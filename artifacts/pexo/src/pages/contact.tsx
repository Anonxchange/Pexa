import { useHead } from "@unhead/react";
import {
  Search,
  Globe,
  Facebook,
  Twitter,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Paperclip,
  X,
  CheckCircle,
  AlertCircle,
  Mail,
  Clock,
  ShieldCheck,
  Home as HomeIcon,
} from '@/lib/icons';
import { useState, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Link } from "wouter";
import { LiveChatWidget } from "@/components/live-chat/LiveChatWidget";

const services = [
  { id: "account", label: "Account" },
  { id: "verification", label: "Verification" },
  { id: "deposit", label: "Deposit" },
  { id: "withdrawal", label: "Withdrawal" },
  { id: "visa", label: "Visa Card" },
  { id: "wallet", label: "Wallet & Recovery" },
  { id: "other", label: "Other" },
];

const subOptions: Record<string, { id: string; label: string }[]> = {
  account: [
    { id: "login", label: "Login Issues" },
    { id: "2fa", label: "2FA Reset" },
    { id: "profile", label: "Profile Update" },
    { id: "security", label: "Security Concern" },
  ],
  verification: [
    { id: "kyc_level_1", label: "ID Verification (Level 1)" },
    { id: "kyc_level_2", label: "Address Verification (Level 2)" },
    { id: "kyc_pending", label: "Verification Pending Too Long" },
    { id: "kyc_failed", label: "Verification Failed" },
  ],
  deposit: [
    { id: "missing_deposit", label: "Missing Deposit" },
    { id: "fee_query", label: "Fee Question" },
    { id: "history", label: "Transaction History" },
  ],
  withdrawal: [
    { id: "withdrawal_pending", label: "Pending Withdrawal" },
    { id: "fee_query", label: "Fee Question" },
    { id: "history", label: "Transaction History" },
  ],
  visa: [
    { id: "card_order", label: "Card Ordering" },
    { id: "card_activation", label: "Card Activation" },
    { id: "spending_limits", label: "Spending Limits" },
    { id: "card_lost", label: "Lost / Stolen Card" },
  ],
  wallet: [
    { id: "recovery_phrase", label: "Recovery Phrase" },
    { id: "lost_access", label: "Lost Access to Wallet" },
    { id: "import_wallet", label: "Importing a Wallet" },
  ],
  other: [],
};

const subLabels: Record<string, string> = {
  account: "What is your account request about?",
  verification: "What is your verification request about?",
  deposit: "What is your deposit request about?",
  withdrawal: "What is your withdrawal request about?",
  visa: "What is your Visa card request about?",
  wallet: "What is your wallet request about?",
};

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const ContactPage = () => {
  useHead({
    title: "Contact Us | Pexly",
    meta: [
      {
        name: "description",
        content:
          "Reach the Pexly support team for help with your account or any platform questions.",
      },
    ],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [requestType, setRequestType] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSubOptions = subOptions[selectedService] ?? [];

  const validate = () => {
    const next: Record<string, string> = {};

    if (!selectedService) {
      next.service = "Please select a topic.";
    }

    if (currentSubOptions.length > 0 && !requestType) {
      next.requestType = "Please select a request type.";
    }

    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Please enter a valid email.";
    }

    if (!subject.trim()) {
      next.subject = "Subject is required.";
    }

    if (!description.trim()) {
      next.description = "Please describe your issue.";
    } else if (description.trim().length < 20) {
      next.description =
        "Please provide more detail (at least 20 characters).";
    }

    return next;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    const valid = files.filter(
      (f) =>
        ACCEPTED_TYPES.includes(f.type) &&
        f.size <= MAX_FILE_SIZE_MB * 1024 * 1024
    );

    setAttachments((prev) => [...prev, ...valid].slice(0, 3));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const { error } = await supabase.from("support_requests").insert({
        email: email.trim(),
        service: selectedService,
        request_type: requestType || null,
        subject: subject.trim(),
        description: description.trim(),
        has_attachments: attachments.length > 0,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(
        err?.message?.includes("does not exist")
          ? "Our support system is being set up. Please email support@pexly.app directly."
          : "Something went wrong. Please try again or email support@pexly.app."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[320px] overflow-hidden bg-gradient-to-br from-primary to-primary/80">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute -left-32 top-1/2 w-[500px] h-[500px] animate-curve-float"
              style={{
                background: "#4F46E5",
                borderRadius: "50%",
                transform: "translate(-60%, -30%)",
              }}
            />

            <div
              className="absolute -right-32 top-1/2 w-[500px] h-[500px] animate-curve-float-reverse"
              style={{
                background: "#4F46E5",
                borderRadius: "50%",
                transform: "translate(60%, -20%)",
              }}
            />

            <Sparkles className="absolute top-20 left-[15%] w-4 h-4 text-white/60 animate-sparkle" />
            <Sparkles className="absolute top-32 right-[20%] w-3 h-3 text-white/60 animate-sparkle-delay-1" />
            <Sparkles className="absolute bottom-24 left-[25%] w-3 h-3 text-white/60 animate-sparkle-delay-2" />
            <Sparkles className="absolute bottom-32 right-[15%] w-4 h-4 text-white/60 animate-sparkle" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
            {/* Nav */}
            <nav className="flex items-center justify-between mb-10">
              <Link
                href="/"
                className="text-black font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity"
              >
                Pexly
              </Link>

              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 text-black/80 hover:text-black hover:bg-black/5 rounded-lg transition-colors text-sm font-medium"
                >
                  <HomeIcon className="w-4 h-4" />
                  Home
                </Link>

                <Link
                  href="/support"
                  className="flex items-center gap-2 px-4 py-2 text-black/80 hover:text-black hover:bg-black/5 rounded-lg transition-colors text-sm font-medium"
                >
                  Help Center
                </Link>
              </div>
            </nav>

            {/* Breadcrumb */}
            <div className="mb-5 flex items-center gap-1.5 text-black/70 text-sm">
              <Link
                href="/support"
                className="hover:text-black transition-colors"
              >
                Help Center
              </Link>

              <ChevronRight className="w-3.5 h-3.5" />

              <span className="font-medium text-black">
                Submit a request
              </span>
            </div>

            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Submit a request
              </h1>

              <div className="relative max-w-xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search Help Center"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/support?q=${encodeURIComponent(
                        searchQuery.trim()
                      )}`;
                    }
                  }}
                  className="w-full py-4 pl-14 pr-6 rounded-full bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 text-base shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Page body */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {submitted ? (
            <div className="max-w-lg mx-auto text-center py-16">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-3">
                Request submitted
              </h2>

              <p className="text-muted-foreground mb-1">
                We've received your message and will reply to{" "}
                <strong className="text-foreground">{email}</strong> as soon
                as possible.
              </p>

              <p className="text-muted-foreground text-sm mb-8">
                Typical response time: 24–48 hours
              </p>

              <Link
                href="/support"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline underline-offset-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Help Center
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left — form */}
              <div className="flex-1 min-w-0">
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-6"
                >
                  {/* Topic */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground block">
                      What can we help you with?{" "}
                      <span className="text-destructive">*</span>
                    </label>

                    <Select
                      value={selectedService}
                      onValueChange={(val) => {
                        setSelectedService(val);
                        setRequestType("");
                        setErrors((e) => ({
                          ...e,
                          service: "",
                          requestType: "",
                        }));
                      }}
                    >
                      <SelectTrigger
                        className={`w-full h-11 text-sm ${
                          errors.service ? "border-destructive" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>

                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {errors.service && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.service}
                      </p>
                    )}
                  </div>

                  {selectedService && (
                    <div className="space-y-6 animate-fade-in">
                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground block">
                          Your email address{" "}
                          <span className="text-destructive">*</span>
                        </label>

                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors((err) => ({
                              ...err,
                              email: "",
                            }));
                          }}
                          className={`h-11 text-sm ${
                            errors.email ? "border-destructive" : ""
                          }`}
                          placeholder="you@example.com"
                          required
                        />

                        {errors.email && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Request type sub-select */}
                      {currentSubOptions.length > 0 && (
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-foreground block">
                            {subLabels[selectedService] ??
                              "What is your request about?"}{" "}
                            <span className="text-destructive">*</span>
                          </label>

                          <Select
                            value={requestType}
                            onValueChange={(val) => {
                              setRequestType(val);
                              setErrors((e) => ({
                                ...e,
                                requestType: "",
                              }));
                            }}
                          >
                            <SelectTrigger
                              className={`w-full h-11 text-sm ${
                                errors.requestType
                                  ? "border-destructive"
                                  : ""
                              }`}
                            >
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>

                            <SelectContent>
                              {currentSubOptions.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {errors.requestType && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.requestType}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Subject */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground block">
                          Subject{" "}
                          <span className="text-destructive">*</span>
                        </label>

                        <Input
                          value={subject}
                          onChange={(e) => {
                            setSubject(e.target.value);
                            setErrors((err) => ({
                              ...err,
                              subject: "",
                            }));
                          }}
                          className={`h-11 text-sm ${
                            errors.subject ? "border-destructive" : ""
                          }`}
                          placeholder="Brief summary of your issue"
                          required
                        />

                        {errors.subject && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.subject}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground block">
                          Description{" "}
                          <span className="text-destructive">*</span>
                        </label>

                        <Textarea
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            setErrors((err) => ({
                              ...err,
                              description: "",
                            }));
                          }}
                          className={`min-h-[160px] resize-none text-sm ${
                            errors.description
                              ? "border-destructive"
                              : ""
                          }`}
                          placeholder="Please describe your issue in detail. Include any relevant transaction IDs or screenshots."
                          required
                        />

                        <div className="flex items-center justify-between">
                          {errors.description ? (
                            <p className="text-xs text-destructive">
                              {errors.description}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              A member of our team will respond as soon as
                              possible.
                            </p>
                          )}

                          <span
                            className={`text-xs tabular-nums ${
                              description.length > 0 &&
                              description.length < 20
                                ? "text-destructive"
                                : "text-muted-foreground"
                            }`}
                          >
                            {description.length} chars
                          </span>
                        </div>
                      </div>

                      {/* Attachments */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground block">
                          Attachments{" "}
                          <span className="text-muted-foreground font-normal">
                            (optional · max 3 files · 5 MB each)
                          </span>
                        </label>

                        <div
                          className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer group"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                              <Paperclip className="w-5 h-5" />
                            </div>

                            <span className="text-sm text-muted-foreground">
                              Click to add files — PNG, JPG, PDF
                            </span>
                          </div>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept={ACCEPTED_TYPES.join(",")}
                          className="hidden"
                          onChange={handleFileChange}
                        />

                        {attachments.length > 0 && (
                          <ul className="mt-2 space-y-1.5">
                            {attachments.map((f, i) => (
                              <li
                                key={i}
                                className="flex items-center justify-between text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2 border border-border"
                              >
                                <span className="truncate max-w-[85%] text-xs">
                                  {f.name}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => removeFile(i)}
                                  className="text-muted-foreground hover:text-destructive transition-colors ml-2 flex-shrink-0"
                                  aria-label="Remove file"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Server error */}
                      {submitError && (
                        <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm text-destructive">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="h-11 px-8 font-semibold text-sm rounded-lg disabled:opacity-60"
                      >
                        {submitting ? "Submitting…" : "Submit request"}
                      </Button>
                    </div>
                  )}
                </form>
              </div>

              {/* Right sidebar — info panels */}
              <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
                {/* Response time */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>

                    <h3 className="text-sm font-semibold text-foreground">
                      Response time
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our team typically responds within{" "}
                    <strong className="text-foreground">
                      24–48 hours
                    </strong>{" "}
                    on business days.
                  </p>
                </div>

                {/* Direct email */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>

                    <h3 className="text-sm font-semibold text-foreground">
                      Email us directly
                    </h3>
                  </div>

                  <a
                    href="mailto:support@pexly.app"
                    className="text-sm text-primary font-medium hover:underline underline-offset-2 break-all"
                  >
                    support@pexly.app
                  </a>

                  <p className="text-xs text-muted-foreground mt-1">
                    For urgent issues or if the form isn't working.
                  </p>
                </div>

                {/* Security note */}
                <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-destructive" />
                    </div>

                    <h3 className="text-sm font-semibold text-foreground">
                      Stay safe
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Pexly support will{" "}
                    <strong className="text-foreground">NEVER</strong> ask for
                    your seed phrase, private keys, or password. Anyone who
                    does is a scammer.
                  </p>
                </div>

                {/* Back to help center */}
                <Link
                  href="/support"
                  className="flex items-center justify-between w-full bg-card border border-border rounded-xl p-4 hover:bg-muted/40 transition-colors group"
                >
                  <span className="text-sm font-medium text-foreground">
                    Browse Help Center
                  </span>

                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border bg-card mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © Pexly Technologies, Inc.
            </p>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                <Globe className="w-4 h-4" />
                <span>English (US)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <LiveChatWidget />
    </div>
  );
};

export default ContactPage;
