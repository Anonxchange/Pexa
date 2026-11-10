import { useState, useMemo, useRef, useEffect } from "react";
import { X, ChevronRight, LayoutGrid, Search, Package } from '@/lib/icons';
import { sanitizeImageUrl } from "@/lib/sanitize";
import { CartLoadingAnimation } from "@/components/shop/CartLoadingAnimation";

const CAT_SEPARATOR = " > ";

interface CategoryNode {
  name: string;
  fullPath: string;
  children: CategoryNode[];
}

interface Listing {
  id: string;
  handle?: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  user_id: string;
  variantId?: string;
}

interface CategoryBrowserModalProps {
  open: boolean;
  onClose: () => void;
  categoryTree: CategoryNode[];
  initialL1: string | null;
  productCountByCategory: Record<string, number>;
  categoryImages: Record<string, string>;
  onSelectCategory: (fullPath: string) => void;
  products?: Listing[];
  onViewProduct?: (product: Listing) => void;
}

function flattenTree(nodes: CategoryNode[]): CategoryNode[] {
  const result: CategoryNode[] = [];
  const walk = (list: CategoryNode[]) => {
    for (const n of list) {
      result.push(n);
      if (n.children.length) walk(n.children);
    }
  };
  walk(nodes);
  return result;
}

export function CategoryBrowserModal({
  open,
  onClose,
  categoryTree,
  initialL1,
  productCountByCategory,
  categoryImages,
  onSelectCategory,
  products = [],
  onViewProduct,
}: CategoryBrowserModalProps) {
  const [activeL1, setActiveL1] = useState<string | null>(initialL1);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) {
      setSearch("");
      setActiveL1(initialL1);
      setTimeout(() => searchRef.current?.focus(), 80);
    }
    wasOpen.current = open;
  }, [open, initialL1]);

  const selectedL1Node = useMemo(
    () => (activeL1 ? categoryTree.find(n => n.fullPath === activeL1) ?? null : null),
    [categoryTree, activeL1]
  );

  const allNodes = useMemo(() => flattenTree(categoryTree), [categoryTree]);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    return allNodes.filter(n =>
      n.name.toLowerCase().includes(q) || n.fullPath.toLowerCase().includes(q)
    );
  }, [search, allNodes]);

  const categoryProducts = useMemo(() => {
    if (!selectedL1Node) return [];
    return products.filter(
      p => p.category === selectedL1Node.fullPath ||
           p.category.startsWith(selectedL1Node.fullPath + CAT_SEPARATOR)
    );
  }, [products, selectedL1Node]);

  if (!open) return null;

  const handleSelectLeaf = (fullPath: string) => {
    onSelectCategory(fullPath);
    onClose();
  };

  const handleViewProduct = (product: Listing) => {
    onClose();
    onViewProduct?.(product);
  };

  const isSearching = searchResults !== null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full sm:max-w-3xl max-h-[88vh] sm:max-h-[80vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
          <h2 className="text-base font-semibold">All Categories</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-4 py-2.5 border-b border-border flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search categories…"
              className="w-full pl-8 pr-8 py-2 text-sm bg-muted/50 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-colors placeholder:text-muted-foreground"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">

          {/* ── Left sidebar: text-only L1 list ── */}
          {!isSearching && (
            <div className="w-28 sm:w-36 flex-shrink-0 border-r border-border overflow-y-auto py-2 bg-muted/30">
              <button
                onClick={() => { setActiveL1(null); handleSelectLeaf("All"); }}
                className={`w-full flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-colors ${
                  activeL1 === null
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <LayoutGrid className="h-4 w-4 flex-shrink-0" />
                <span>All</span>
              </button>

              {categoryTree.map(node => (
                <button
                  key={node.fullPath}
                  onClick={() => setActiveL1(activeL1 === node.fullPath ? null : node.fullPath)}
                  className={`w-full text-center px-2 py-2.5 text-xs font-medium transition-colors leading-snug border-l-2 ${
                    activeL1 === node.fullPath
                      ? "border-primary text-foreground font-semibold bg-background"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {node.name}
                </button>
              ))}
            </div>
          )}

          {/* ── Right panel ── */}
          <div className="flex-1 overflow-y-auto">

            {/* Search results */}
            {isSearching ? (
              searchResults!.length > 0 ? (
                <div className="p-4 space-y-1">
                  <div className="grid grid-cols-3 gap-x-3 gap-y-5">
                    {searchResults!.map(node => (
                      <CategoryTile
                        key={node.fullPath}
                        node={node}
                        image={categoryImages[node.fullPath]}
                        onClick={() => handleSelectLeaf(node.fullPath)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
                  <Search className="h-10 w-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    No categories match{" "}
                    <span className="font-medium text-foreground">"{search}"</span>
                  </p>
                  <button onClick={() => setSearch("")} className="text-xs text-primary hover:underline">
                    Clear search
                  </button>
                </div>
              )

            ) : !selectedL1Node ? (
              /* No selection → show all L1 categories */
              <div className="p-4">
                <div className="grid grid-cols-3 gap-x-3 gap-y-5">
                  {categoryTree.map(node => (
                    <CategoryTile
                      key={node.fullPath}
                      node={node}
                      image={categoryImages[node.fullPath]}
                      onClick={() => setActiveL1(node.fullPath)}
                    />
                  ))}
                </div>
              </div>

            ) : selectedL1Node.children.length > 0 ? (
              /* L1 has subcategories → sections per L2, tiles per L3 */
              <div className="pb-6">
                {selectedL1Node.children.map((l2, idx) => (
                  <div key={l2.fullPath} className={idx > 0 ? "border-t border-border" : ""}>
                    {/* Section header */}
                    <button
                      onClick={() => handleSelectLeaf(l2.fullPath)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-sm font-semibold text-foreground">{l2.name}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {/* Tiles grid */}
                    <div className="px-4 pb-4 grid grid-cols-3 gap-x-3 gap-y-5">
                      {l2.children.length > 0
                        ? l2.children.map(l3 => (
                            <CategoryTile
                              key={l3.fullPath}
                              node={l3}
                              image={categoryImages[l3.fullPath]}
                              onClick={() => handleSelectLeaf(l3.fullPath)}
                            />
                          ))
                        : (
                            <CategoryTile
                              node={l2}
                              image={categoryImages[l2.fullPath]}
                              onClick={() => handleSelectLeaf(l2.fullPath)}
                            />
                          )}
                    </div>
                  </div>
                ))}
              </div>

            ) : (
              /* Leaf category — show products */
              <div className="p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground">{selectedL1Node.name}</p>

                {categoryProducts.length > 0 ? (
                  <div className="grid grid-cols-3 gap-x-3 gap-y-5">
                    {categoryProducts.slice(0, 9).map(product => (
                      <ProductTile
                        key={product.id}
                        product={product}
                        onClick={() => handleViewProduct(product)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <Package className="h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No products in this category yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Category tile — no card border, just image + label ── */
interface CategoryTileProps {
  node: CategoryNode;
  image?: string;
  onClick: () => void;
}

function CategoryTile({ node, image, onClick }: CategoryTileProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 text-center group"
    >
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted/60 relative">
        {image ? (
          <>
            {!loaded && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <CartLoadingAnimation size={32} />
              </div>
            )}
            <img
              src={image}
              alt={node.name}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                loaded ? 'opacity-100' : 'absolute inset-0 opacity-0 pointer-events-none'
              }`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <LayoutGrid className="h-7 w-7 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <p className="text-xs text-foreground leading-snug group-hover:text-primary transition-colors px-0.5">
        {node.name}
      </p>
    </button>
  );
}

/* ── Product tile — no card border, just image + label ── */
interface ProductTileProps {
  product: Listing;
  onClick: () => void;
}

function ProductTile({ product, onClick }: ProductTileProps) {
  const [loaded, setLoaded] = useState(false);
  const hasImage = !!product.images[0];

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 text-center group"
    >
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted/60 relative">
        {hasImage ? (
          <>
            {!loaded && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <CartLoadingAnimation size={32} />
              </div>
            )}
            <img
              src={sanitizeImageUrl(product.images[0])}
              alt={product.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                loaded ? 'opacity-100' : 'absolute inset-0 opacity-0 pointer-events-none'
              }`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-7 w-7 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <p className="text-xs text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors px-0.5">
        {product.title}
      </p>
    </button>
  );
}
