import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Star, Loader2, MessageSquare, Share2, Flag, ChevronRight, ChevronDown } from '@/lib/icons';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth-context";
import { getSupabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { ImportedReview } from "@/lib/shopify-service";

// Unified shape both DB reviews and imported (Air Reviews app metafield) reviews get mapped into,
// so the list, average, and breakdown all treat them the same way.
interface UnifiedReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  displayName: string | null;
  images: string[];
  videos: string[];
  countryCode?: string;
  // Store (Supabase) reviews are always from real signed-in buyers on this
  // site, so they're always "verified" in our UI sense. Imported reviews
  // carry their own verification flag from the source data.
  verified: boolean;
  source: "store" | "imported";
}

// Converts a 2-letter ISO country code (e.g. "GR", "NL") into a flag emoji
// using the Unicode Regional Indicator trick — no image, no external
// lookup, so it can't be blocked by any CSP img-src rule.
function countryCodeToFlag(code?: string): string | null {
  if (!code || code.length !== 2) return null;
  const upper = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return null;
  const codePoints = [...upper].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...codePoints);
}

interface ReviewSectionProps {
  productId: string;
  importedReviews?: ImportedReview[];
  // When the caller already provides its own top divider/spacing (e.g. the
  // mobile Description/Reviews tab section on the product page), pass
  // `compact` to skip this component's own leading margin + separator so
  // the two don't stack into a double divider with a big empty gap.
  compact?: boolean;
}

/** Inline SVG "verified" badge — blue circle, white check, Twitter/X style.
 *  Deliberately inline (no external image request) so it renders even under
 *  a strict CSP that blocks third-party image hosts. Shown whenever
 *  review.verified is true — always true for our own store (Supabase)
 *  reviews, and driven by the source's own `verified` flag for imported
 *  (Air Reviews) reviews. */
function VerifiedBadge({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 22 22"
      className={className}
      aria-label="Verified buyer on this store"
      role="img"
    >
      <path
        d="M11 0l2.2 1.6 2.7-.4 1.1 2.5 2.5 1.1-.4 2.7L20.6 9.7 19 12l1.6 2.3-1.6 2.7.4 2.7-2.5 1.1-1.1 2.5-2.7-.4L11 22l-2.2-1.6-2.7.4-1.1-2.5-2.5-1.1.4-2.7L1.4 12.3 3 10l-1.6-2.3.1-.1-.4-2.7 2.5-1.1L4.7 1.3l2.7.4L11 0z"
        fill="#1D9BF0"
      />
      <path
        d="M9.6 14.9 6.3 11.6l1.1-1.1 2.2 2.2 5-5 1.1 1.1-6.1 6.1z"
        fill="#ffffff"
      />
    </svg>
  );
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}) {
  const [hovered, setHovered] = useState(0);
  const dim = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            className={`${dim} transition-colors ${
              star <= (hovered || value)
                ? "fill-[url(#pexly-review-star-gradient)] text-amber-500 drop-shadow-[0_1px_1.5px_rgba(180,83,9,0.3)]"
                : "fill-muted text-muted-foreground/40"
            }`}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

function averageRating(reviews: UnifiedReview[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// Soft pastel avatar tones (Shop-app style) instead of the brand-primary tint.
// Full class strings so Tailwind can see them. Picked deterministically from
// the reviewer's name so a person always gets the same colour.
const AVATAR_TONES = [
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300",
];

function avatarTone(name: string | null): string {
  const str = name || "U";
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) hash = (hash * 31 + str.charCodeAt(i)) | 0;
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
}

function ReviewAvatar({ name, className = "h-8 w-8 text-xs" }: { name: string | null; className?: string }) {
  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-bold ${avatarTone(name)} ${className}`}
      aria-hidden="true"
    >
      {(name || "U")[0].toUpperCase()}
    </div>
  );
}

function formatReviewDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

type ReviewSort = "recent" | "oldest" | "high" | "low";

const HIDE_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

// Local-only "helpful" state, keyed by `${source}-${id}`.
// NOTE: this is client-side/session-only for now — no persistence yet.
// A real implementation needs a `review_votes` table (or a `helpful_count`
// column + RPC) so counts survive reload and a user can't vote twice.
type HelpfulState = Record<string, { clicked: boolean; count: number }>;

// Lightbox state: which review's media gallery is open, and which index.
interface LightboxState {
  key: string;
  media: ReviewMedia[];
  index: number;
  reviewerName: string;
}

type ReviewMedia = { type: "image" | "video"; url: string };

// Combine a review's images + videos into one ordered gallery (images first,
// then videos) so the UI has one code path regardless of which the source
// data actually populated.
function reviewMedia(r: UnifiedReview): ReviewMedia[] {
  return [
    ...r.images.map((url) => ({ type: "image" as const, url })),
    ...r.videos.map((url) => ({ type: "video" as const, url })),
  ];
}

export function ReviewSection({ productId, importedReviews = [], compact = false }: ReviewSectionProps) {
  const { user } = useAuth();
  const [dbReviews, setDbReviews] = useState<UnifiedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState("");
  const [myReview, setMyReview] = useState<{ id: string; rating: number; comment: string | null } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [helpful, setHelpful] = useState<HelpfulState>({});
  const [reportingReview, setReportingReview] = useState<UnifiedReview | null>(null);
  const [reportReason, setReportReason] = useState("fake");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  // Mobile (compact) full-screen "all reviews" view + its search/sort/filter.
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<ReviewSort>("recent");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Keyboard navigation for the lightbox (Esc / ← / →)
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") stepLightbox(1);
      if (e.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox]);

  // Lock page scroll behind the full-screen reviews view.
  useEffect(() => {
    if (!showAll) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showAll]);

  useEffect(() => {
    if (!showAll) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !lightbox && !reportingReview) setShowAll(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showAll, lightbox, reportingReview]);

  async function fetchReviews() {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from("product_reviews")
        .select("id, user_id, rating, comment, created_at, display_name")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const mapped: UnifiedReview[] = (data || []).map((r: any) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at,
        displayName: r.display_name,
        images: [],
        videos: [],
        countryCode: undefined,
        verified: true,
        source: "store",
      }));
      setDbReviews(mapped);

      if (user) {
        const mine = (data || []).find((r: any) => r.user_id === user.id);
        if (mine) {
          setMyReview({ id: mine.id, rating: mine.rating, comment: mine.comment });
          setMyRating(mine.rating);
          setMyComment(mine.comment || "");
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function submitReview() {
    if (!user) return;
    if (myRating < 1) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      const supabase = await getSupabase();
      const displayName =
        user.user_metadata?.full_name ||
        user.user_metadata?.username ||
        user.email?.split("@")[0] ||
        "User";

      const payload = {
        product_id: productId,
        user_id: user.id,
        rating: myRating,
        comment: myComment.trim() || null,
        display_name: displayName,
      };

      let error;
      if (myReview) {
        ({ error } = await supabase
          .from("product_reviews")
          .update({ rating: myRating, comment: payload.comment })
          .eq("id", myReview.id));
      } else {
        ({ error } = await supabase.from("product_reviews").insert(payload));
      }

      if (error) throw error;
      toast.success(myReview ? "Review updated!" : "Review submitted!");
      setShowForm(false);
      await fetchReviews();
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Merge store (Supabase) reviews with imported (Air Reviews metafield) reviews into one
  // list, newest first, so the average/breakdown/list all reflect both sources together.
  const mappedImported: UnifiedReview[] = importedReviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment || null,
    createdAt: r.createdAt,
    displayName: r.displayName,
    images: r.images,
    videos: r.videos || [],
    countryCode: r.countryCode,
    // `verified` here is the source's own review-verification flag (distinct
    // from `verifyBuyer`/verifiedBuyer, which tracks purchase-matching and
    // is unreliable in the sample data — see shopify-storefront.ts).
    verified: Boolean((r as any).verified),
    source: "imported",
  }));

  const reviews = [...dbReviews, ...mappedImported].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const avg = averageRating(reviews);
  // With zero reviews there's nothing to average yet — show a neutral full
  // rating (matching the "5.0 (0)" placeholder pattern) rather than 0.0,
  // which would look like the product scored badly.
  const displayAvg = reviews.length ? avg : 5;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  function reviewKey(r: UnifiedReview) {
    return `${r.source}-${r.id}`;
  }

  // Every review photo, for the thumbnail strip. Images come first in a
  // review's media gallery, so the image index is also the gallery index.
  const allPhotos = reviews.flatMap((r) => r.images.map((url, index) => ({ review: r, index, url })));

  // Full-screen view: search + rating filter + sort.
  const visibleReviews = reviews
    .filter((r) => ratingFilter === "all" || r.rating === ratingFilter)
    .filter((r) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        (r.comment || "").toLowerCase().includes(q) ||
        (r.displayName || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "high") return b.rating - a.rating;
      if (sortBy === "low") return a.rating - b.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  function toggleHelpful(r: UnifiedReview) {
    const key = reviewKey(r);
    setHelpful((prev) => {
      const cur = prev[key] || { clicked: false, count: 0 };
      const clicked = !cur.clicked;
      return {
        ...prev,
        [key]: { clicked, count: Math.max(0, cur.count + (clicked ? 1 : -1)) },
      };
    });
  }

  async function shareReview(r: UnifiedReview) {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `Review by ${r.displayName || "a customer"}`;
    const text = r.comment
      ? `"${r.comment.slice(0, 120)}" — ${r.displayName || "a customer"}`
      : `${r.displayName || "A customer"} left a ${r.rating}-star review`;
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title, text, url });
        return;
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  }

  function openReport(r: UnifiedReview) {
    setReportReason("fake");
    setReportDetails("");
    setReportingReview(r);
  }

  async function submitReviewReport() {
    if (!reportingReview) return;
    setIsSubmittingReport(true);
    try {
      // Placeholder — no backend table for review reports yet.
      // Wire this up to a `review_reports` insert (or similar) in the data pass.
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Report submitted. Our team will review this.");
      setReportingReview(null);
      setReportDetails("");
      setReportReason("fake");
    } catch {
      toast.error("Could not submit report. Please try again.");
    } finally {
      setIsSubmittingReport(false);
    }
  }

  function openLightbox(r: UnifiedReview, index: number) {
    setLightbox({
      key: reviewKey(r),
      media: reviewMedia(r),
      index,
      reviewerName: r.displayName || "Reviewer",
    });
  }

  function stepLightbox(delta: number) {
    setLightbox((prev) => {
      if (!prev) return prev;
      const len = prev.media.length;
      const next = (prev.index + delta + len) % len;
      return { ...prev, index: next };
    });
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 40) stepLightbox(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  const writeForm = (
    <>
    {showForm && user && (
              <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-4">
                <p className="font-semibold text-sm">{myReview ? "Update your review" : "Your review"}</p>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <StarRating value={myRating} onChange={setMyRating} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Comment (optional)</p>
                  <Textarea
                    value={myComment}
                    onChange={(e) => setMyComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={3}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground text-right">{myComment.length}/1000</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={submitReview} disabled={submitting}>
                    {submitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                    {myReview ? "Update" : "Submit"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
    </>
  );

  const renderStars = (rating: number) => (
    <StarRating value={rating} readonly size="sm" />
  );

  const renderMediaThumbs = (review: UnifiedReview) => {
    const media = reviewMedia(review);
    if (media.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 pt-1">
        {media.slice(0, 4).map((m, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openLightbox(review, i)}
            className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-lg overflow-hidden border border-border/60 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-muted"
            aria-label={`View ${m.type} ${i + 1} from ${review.displayName || "reviewer"}`}
          >
            {m.type === "video" ? (
              <video
                src={m.url}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <img
                src={m.url}
                alt={`${review.displayName || "Reviewer"}'s photo ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            )}
            {m.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white text-sm">▶</div>
              </div>
            )}
            {i === 3 && media.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                +{media.length - 4}
              </div>
            )}
          </button>
        ))}
      </div>
    );
  };

  // Full review card — desktop list and the mobile full-screen view.
  const renderFullCard = (review: UnifiedReview) => {
    const key = reviewKey(review);
    const hs = helpful[key];
    return (
      <div key={key} className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ReviewAvatar name={review.displayName} />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold">{review.displayName || "Anonymous"}</p>
                {countryCodeToFlag(review.countryCode) && (
                  <span aria-label={review.countryCode} title={review.countryCode} className="text-sm leading-none">
                    {countryCodeToFlag(review.countryCode)}
                  </span>
                )}
                {review.verified && <VerifiedBadge />}
              </div>
              <p className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</p>
            </div>
          </div>
          {renderStars(review.rating)}
        </div>

        {review.comment && (
          <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
        )}

        {renderMediaThumbs(review)}

        <div className="flex items-center gap-4 pt-1 text-xs font-medium text-muted-foreground">
          <button
            type="button"
            onClick={() => shareReview(review)}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
          <button
            type="button"
            onClick={() => toggleHelpful(review)}
            className={`flex items-center gap-1.5 transition-colors ${
              hs?.clicked ? "text-primary" : "hover:text-foreground"
            }`}
          >
            👍 Helpful{hs?.count ? ` (${hs.count})` : ""}
          </button>
          <button
            type="button"
            onClick={() => openReport(review)}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Flag className="h-3.5 w-3.5" />
            Report
          </button>
        </div>
      </div>
    );
  };

  /* ── Mobile (compact) layout ─────────────────────────────────────────── */

  const renderSummary = () => (
    <div className="flex items-center justify-between gap-6">
      <div className="shrink-0">
        <p className="text-5xl font-bold leading-none">{displayAvg.toFixed(1)}</p>
        <div className="mt-2">
          <StarRating value={Math.round(displayAvg)} readonly />
        </div>
        <p className="mt-1.5 text-sm text-foreground">
          {reviews.length} rating{reviews.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="flex-1 space-y-1.5">
        {ratingCounts.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-2">
            <span className="w-3 text-sm text-foreground">{star}</span>
            <div className="h-2.5 flex-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground"
                style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPhotoStrip = (sizeClass: string, bleedClass: string) => {
    if (allPhotos.length === 0) return null;
    return (
      <div className={`flex gap-2 overflow-x-auto ${HIDE_SCROLLBAR} ${bleedClass}`}>
        {allPhotos.slice(0, 20).map((ph) => (
          <button
            key={`${reviewKey(ph.review)}-${ph.index}`}
            type="button"
            onClick={() => openLightbox(ph.review, ph.index)}
            className={`shrink-0 overflow-hidden rounded-xl bg-muted ${sizeClass}`}
            aria-label={`View photo from ${ph.review.displayName || "reviewer"}`}
          >
            <img src={ph.url} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    );
  };

  const renderCarouselCard = (review: UnifiedReview) => (
    <div
      key={reviewKey(review)}
      role="button"
      tabIndex={0}
      onClick={() => setShowAll(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setShowAll(true);
      }}
      className="snap-start shrink-0 w-[82%] rounded-2xl border border-border/60 bg-card p-4 flex flex-col gap-2 cursor-pointer"
    >
      {renderStars(review.rating)}
      {review.comment ? (
        <p
          className="text-base text-foreground leading-snug"
          style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {review.comment}
        </p>
      ) : (
        <p className="text-base text-muted-foreground">Rated {review.rating} out of 5</p>
      )}
      <div className="mt-auto flex items-center gap-2 pt-2">
        <ReviewAvatar name={review.displayName} className="h-9 w-9 text-sm" />
        <div className="min-w-0 flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="truncate">{review.displayName || "Anonymous"}</span>
          {countryCodeToFlag(review.countryCode) && (
            <span className="leading-none">{countryCodeToFlag(review.countryCode)}</span>
          )}
          {review.verified && <VerifiedBadge />}
          <span className="shrink-0">· {formatReviewDate(review.createdAt)}</span>
        </div>
      </div>
    </div>
  );

  const writeLink = user ? (
    !showForm && (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center text-sm font-medium text-foreground whitespace-nowrap"
      >
        {myReview ? "Edit your review" : "Write a review"}
        <ChevronRight className="h-4 w-4" />
      </button>
    )
  ) : (
    <a href="/signin" className="flex items-center text-sm font-medium text-foreground whitespace-nowrap">
      Add your review
      <ChevronRight className="h-4 w-4" />
    </a>
  );

  const renderCompact = () => (
    <div className="rounded-3xl border border-border/60 bg-card p-5 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Reviews</h2>
        {writeLink}
      </div>

      {writeForm}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <>
          {renderSummary()}
          {renderPhotoStrip("h-[60px] w-[60px]", "-mx-5 px-5")}

          {/* Horizontal, snap-scrolling review cards */}
          <div className={`-mx-5 px-5 flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-5 pb-1 ${HIDE_SCROLLBAR}`}>
            {reviews.slice(0, 10).map((review) => renderCarouselCard(review))}
          </div>

          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="w-full rounded-full bg-muted py-4 text-lg font-medium text-foreground active:opacity-80 transition-opacity"
          >
            Read more reviews
          </button>
        </>
      )}
    </div>
  );

  const renderAllReviewsSheet = () => {
    if (!showAll || typeof document === "undefined") return null;
    const selectClass =
      "appearance-none rounded-full border border-border/60 bg-background pl-4 pr-10 py-3 text-base font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";
    return createPortal(
      <div
        // Drops below the report dialog (z-50) while it's open so the dialog
        // isn't hidden behind this full-screen view.
        className={`fixed inset-0 ${reportingReview ? "z-40" : "z-[95]"} bg-background overflow-y-auto`}
        role="dialog"
        aria-modal="true"
        aria-label="All reviews"
      >
        <div className="mx-auto max-w-2xl space-y-5 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setShowAll(false)}
            aria-label="Close reviews"
            className="h-12 w-12 rounded-full border border-border/60 bg-card shadow-sm flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <h2 className="text-4xl font-bold">Reviews</h2>

          {reviews.length > 0 && renderSummary()}
          {renderPhotoStrip("h-20 w-20", "-mx-5 px-5")}

          {/* Search */}
          <div className="flex items-center gap-3 rounded-full border border-border/60 bg-background px-4 py-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted-foreground shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Sort / rating filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                aria-label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as ReviewSort)}
                className={selectClass}
              >
                <option value="recent">Most recent</option>
                <option value="oldest">Oldest</option>
                <option value="high">Highest rating</option>
                <option value="low">Lowest rating</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
            <div className="relative">
              <select
                aria-label="Rating"
                value={String(ratingFilter)}
                onChange={(e) => setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
                className={selectClass}
              >
                <option value="all">Rating</option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
          </div>

          {visibleReviews.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No reviews match your search.</p>
          ) : (
            <div className="space-y-4">{visibleReviews.map((review) => renderFullCard(review))}</div>
          )}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className={compact ? "space-y-6" : "mt-12 space-y-8"}>
      {/* Gradient definition shared by every star in this component — one
          copy in the DOM, referenced by id from each filled star below.
          0×0 and aria-hidden: no layout, no network request. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="pexly-review-star-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="55%" stopColor="#f5b942" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
      {compact && renderCompact()}
      {compact && renderAllReviewsSheet()}
      {!compact && <Separator />}
      {!compact && (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-bold">Reviews</h2>
          {reviews.length > 0 && (
            <span className="text-sm text-muted-foreground">({reviews.length})</span>
          )}
        </div>

        {/* Summary — always visible, even with zero reviews or logged out,
            so there's always something to look at and a clear way in. */}
        <div className="space-y-4 p-5 rounded-xl border border-border/60 bg-card/50">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-muted-foreground">Overall Rating</p>
            {user ? (
              !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center text-sm font-medium text-foreground hover:underline underline-offset-2 whitespace-nowrap"
                >
                  {myReview ? "Edit your review" : "Write a review"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              )
            ) : (
              <a
                href="/signin"
                className="flex items-center text-sm font-medium text-foreground hover:underline underline-offset-2 whitespace-nowrap"
              >
                Add your review
                <ChevronRight className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{displayAvg.toFixed(1)}</span>
            <StarRating value={Math.round(displayAvg)} readonly size="sm" />
            <span className="text-sm text-muted-foreground">({reviews.length})</span>
          </div>

          <div className="space-y-1.5">
            {ratingCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-right text-muted-foreground">{star}</span>
                <Star
                  className="h-3.5 w-3.5 fill-[url(#pexly-review-star-gradient)] text-amber-500 drop-shadow-[0_1px_1px_rgba(180,83,9,0.3)]"
                  strokeWidth={1.5}
                />
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all"
                    style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
                  />
                </div>
                <span className="w-4 text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {writeForm}

        {/* Review list */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No reviews yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-4">{reviews.map((review) => renderFullCard(review))}</div>
        )}
      </div>
      )}

      {/* Fullscreen scrollable image viewer */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors"
          >
            ×
          </button>

          <div className="absolute top-4 left-4 text-white/80 text-sm">
            {lightbox.reviewerName} · {lightbox.index + 1}/{lightbox.media.length}
          </div>

          {lightbox.media.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                stepLightbox(-1);
              }}
              aria-label="Previous item"
              className="absolute left-2 sm:left-6 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition-colors"
            >
              ‹
            </button>
          )}

          {lightbox.media[lightbox.index]?.type === "video" ? (
            <video
              key={lightbox.index}
              src={lightbox.media[lightbox.index].url}
              controls
              autoPlay
              playsInline
              className="max-h-[85vh] max-w-[92vw] rounded-md select-none"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            />
          ) : (
            <img
              src={lightbox.media[lightbox.index]?.url}
              alt={`${lightbox.reviewerName}'s photo ${lightbox.index + 1}`}
              className="max-h-[85vh] max-w-[92vw] object-contain rounded-md select-none"
              draggable={false}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            />
          )}

          {lightbox.media.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                stepLightbox(1);
              }}
              aria-label="Next item"
              className="absolute right-2 sm:right-6 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition-colors"
            >
              ›
            </button>
          )}

          {lightbox.media.length > 1 && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.media.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightbox((prev) => (prev ? { ...prev, index: i } : prev))}
                  aria-label={`Go to item ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === lightbox.index ? "w-5 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Report review dialog */}
      <AlertDialog open={!!reportingReview} onOpenChange={(open) => !open && setReportingReview(null)}>
        <AlertDialogContent
          className="
            inset-x-0 bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0
            w-full max-w-full rounded-t-2xl rounded-b-none border-b-0
            max-h-[88vh] overflow-y-auto
            pb-[max(1.5rem,env(safe-area-inset-bottom))]
            data-[state=open]:slide-in-from-bottom data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0
            data-[state=closed]:slide-out-to-bottom data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0
            sm:inset-auto sm:left-[50%] sm:right-auto sm:top-[50%] sm:bottom-auto
            sm:translate-x-[-50%] sm:translate-y-[-50%]
            sm:w-full sm:max-w-lg sm:rounded-lg sm:border sm:max-h-none sm:overflow-visible sm:pb-6
            sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%] sm:data-[state=open]:slide-in-from-bottom-0
            sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%] sm:data-[state=closed]:slide-out-to-bottom-0
          "
        >
          <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-muted sm:hidden" />

          <AlertDialogHeader>
            <AlertDialogTitle>Report this review</AlertDialogTitle>
            <AlertDialogDescription>
              Let us know what's wrong with this review and our trust &amp; safety team will take a look.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <RadioGroup value={reportReason} onValueChange={setReportReason} className="space-y-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="fake" id="rr-fake" />
                <Label htmlFor="rr-fake" className="font-normal cursor-pointer">Fake or incentivized review</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="offensive" id="rr-offensive" />
                <Label htmlFor="rr-offensive" className="font-normal cursor-pointer">Offensive or inappropriate content</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="off-topic" id="rr-off-topic" />
                <Label htmlFor="rr-off-topic" className="font-normal cursor-pointer">Not related to this product</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="other" id="rr-other" />
                <Label htmlFor="rr-other" className="font-normal cursor-pointer">Other</Label>
              </div>
            </RadioGroup>

            <div className="space-y-1.5">
              <Label htmlFor="rr-details" className="text-sm">Additional details (optional)</Label>
              <Textarea
                id="rr-details"
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Add any context that will help us review this…"
                rows={4}
                maxLength={1000}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmittingReport}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={submitReviewReport} disabled={isSubmittingReport}>
              {isSubmittingReport ? "Submitting…" : "Submit report"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
