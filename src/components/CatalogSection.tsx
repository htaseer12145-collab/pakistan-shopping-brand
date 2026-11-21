import { useMemo } from 'react';
import { Check, ExternalLink, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { buildAffiliateUrl, formatPkr } from '../data/products';
import {
  AffiliateConfig,
  AffiliatePartner,
  Product,
  ProductCategory,
  SortOption,
} from '../types';
import { ProductImage } from './ProductImage';

interface CatalogSectionProps {
  products: Product[];
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onlyDiscounts: boolean;
  onToggleDiscounts: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  recentlyAddedId: string | null;
  affiliateConfig: AffiliateConfig;
  onTrackAffiliateClick: (product: Product, partner: AffiliatePartner) => void;
}

const CATEGORIES = Object.values(ProductCategory);

export function CatalogSection({
  products,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  searchQuery,
  onSearchChange,
  onlyDiscounts,
  onToggleDiscounts,
  sortBy,
  onSortChange,
  onSelectProduct,
  onQuickAdd,
  recentlyAddedId,
  affiliateConfig,
  onTrackAffiliateClick,
}: CatalogSectionProps) {
  const brands = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.brand))).sort();
    return ['All Brands', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = products.filter((item) => {
      const matchesCat =
        selectedCategory === ProductCategory.ALL || item.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All Brands' || item.brand === selectedBrand;
      const matchesDiscount = !onlyDiscounts || item.discountPercent > 0;
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.sourceChannel.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesCat && matchesBrand && matchesDiscount && matchesQuery;
    });

    const sorted = [...list];
    switch (sortBy) {
      case SortOption.PRICE_LOW:
        sorted.sort((a, b) => a.pricePkr - b.pricePkr);
        break;
      case SortOption.PRICE_HIGH:
        sorted.sort((a, b) => b.pricePkr - a.pricePkr);
        break;
      case SortOption.HIGHEST_DISCOUNT:
        sorted.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case SortOption.FEATURED:
      default:
        sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
        break;
    }
    return sorted;
  }, [products, selectedCategory, selectedBrand, searchQuery, onlyDiscounts, sortBy]);

  const resetFilters = () => {
    onSelectCategory(ProductCategory.ALL);
    onSelectBrand('All Brands');
    onSearchChange('');
    if (onlyDiscounts) onToggleDiscounts();
    onSortChange(SortOption.FEATURED);
  };

  return (
    <section id="catalog" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      {/* Section Header + Search Toolbar */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#A1A1AA]">
            Curated Daraz &amp; Amazon Catalog
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#F4F4F5] sm:text-3xl">
            Fashion, Wearables, Home &amp; Tech
          </h2>
        </div>

        {/* User-Friendly Search Bar */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search clothes, Meta glasses, watches, air fryer, Daraz..."
              aria-label="Search products by name, brand, category, or sourcing channel"
              className="h-11 w-full rounded-lg border border-white/[0.1] bg-[#12141A] pl-10 pr-9 text-sm text-[#F4F4F5] placeholder:text-[#71717A] focus:border-[#E2A84B] focus:outline-none focus:ring-1 focus:ring-[#E2A84B]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[#A1A1AA] hover:text-[#F4F4F5] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="sort-select" className="sr-only">
              Sort products
            </label>
            <div className="relative flex items-center">
              <SlidersHorizontal
                className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#A1A1AA]"
                aria-hidden="true"
              />
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="h-11 rounded-lg border border-white/[0.1] bg-[#12141A] pl-9 pr-4 text-xs font-medium text-[#F4F4F5] focus:border-[#E2A84B] focus:outline-none cursor-pointer"
              >
                <option value={SortOption.FEATURED}>Sort: Featured</option>
                <option value={SortOption.PRICE_LOW}>Price: Low to High</option>
                <option value={SortOption.PRICE_HIGH}>Price: High to Low</option>
                <option value={SortOption.HIGHEST_DISCOUNT}>Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Category Segmented Filter Tabs */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div
          role="tablist"
          aria-label="Product Categories"
          className="flex flex-wrap items-center gap-1.5"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectCategory(category)}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A84B] ${
                  active
                    ? 'bg-[#F4F4F5] text-[#090A0D]'
                    : 'bg-[#12141A] text-[#A1A1AA] hover:bg-[#191C24] hover:text-[#F4F4F5] border border-white/[0.06]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Discount Filter + Results Count */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleDiscounts}
            aria-pressed={onlyDiscounts}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] border ${
              onlyDiscounts
                ? 'border-[#E2A84B] bg-[#E2A84B]/15 text-[#E2A84B]'
                : 'border-white/[0.08] bg-[#12141A] text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
          >
            {onlyDiscounts ? 'Discounted Offers Only' : 'All Prices'}
          </button>

          <span className="font-mono text-xs tabular-nums text-[#A1A1AA]">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Brand Filter Row */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-[#71717A]">Brands:</span>
        {brands.map((brand) => {
          const active = selectedBrand === brand;
          return (
            <button
              key={brand}
              type="button"
              onClick={() => onSelectBrand(brand)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#E2A84B] text-[#090A0D]'
                  : 'text-[#A1A1AA] hover:bg-white/[0.06] hover:text-[#F4F4F5]'
              }`}
            >
              {brand}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="mt-12 rounded-xl border border-white/[0.08] bg-[#12141A] p-12 text-center">
          <p className="font-display text-lg font-medium text-[#F4F4F5]">
            No matching gadgets found
          </p>
          <p className="mt-2 text-sm text-[#A1A1AA]">
            Try clearing your search term or switching back to all brands and categories.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 rounded-lg bg-[#F4F4F5] px-5 py-2.5 text-xs font-semibold text-[#090A0D] hover:bg-[#E2A84B] transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const isAdded = recentlyAddedId === product.id;
            const partnerLabel =
              product.primaryPartner === 'daraz' ? 'Buy on Daraz.pk' : 'Buy on Amazon';
            const affiliateHref = buildAffiliateUrl(
              product,
              product.primaryPartner,
              affiliateConfig
            );

            return (
              <article
                key={product.id}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-[#12141A] transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/[0.16]"
              >
                {/* 4:3 Studio Product Photography */}
                <div>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="relative block aspect-[4/3] w-full overflow-hidden bg-[#0E1015] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A84B]"
                  >
                    <ProductImage
                      src={product.image}
                      alt={`${product.brand} ${product.name}`}
                      title={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </button>

                  {/* Card Body — Identical Field Order & Unboxed Metadata */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
                      <span className="truncate">
                        {product.brand} · {product.sourceChannel}
                      </span>
                      <span className="shrink-0 text-[#E2A84B]">{product.stockStatus}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="mt-2 block w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A84B] rounded-sm"
                    >
                      <h3 className="font-display text-base font-semibold text-[#F4F4F5] line-clamp-1 group-hover:text-[#E2A84B] transition-colors duration-150">
                        {product.name}
                      </h3>
                    </button>

                    <p className="mt-1.5 text-xs leading-relaxed text-[#A1A1AA] line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Aligned Price & Direct Affiliate / Bag Action Footer */}
                <div className="border-t border-white/[0.06] px-5 py-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-base font-semibold tabular-nums text-[#F4F4F5]">
                        {formatPkr(product.pricePkr)}
                      </span>
                      {product.originalPricePkr > product.pricePkr && (
                        <span className="font-mono text-xs tabular-nums text-[#71717A] line-through">
                          {formatPkr(product.originalPricePkr)}
                        </span>
                      )}
                    </div>
                    {product.discountPercent > 0 && (
                      <span className="font-mono text-xs font-medium tabular-nums text-[#E2A84B]">
                        -{product.discountPercent}% Off
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] text-[#71717A]">{product.deliveryEstimate}</p>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="rounded-lg border border-white/[0.1] bg-transparent px-3 py-2 text-xs font-medium text-[#D4D4D8] hover:border-white/[0.24] hover:text-[#F4F4F5] transition-colors duration-150 whitespace-nowrap cursor-pointer min-h-[40px]"
                    >
                      Specs
                    </button>

                    <a
                      href={affiliateHref}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      onClick={() =>
                        onTrackAffiliateClick(product, product.primaryPartner)
                      }
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#E2A84B] px-3 py-2 text-xs font-semibold text-[#090A0D] hover:bg-[#eab866] transition-colors duration-150 whitespace-nowrap min-h-[40px]"
                    >
                      <span>{partnerLabel}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>

                    <button
                      type="button"
                      onClick={() => onQuickAdd(product)}
                      title="Add to Zayr Select Bag"
                      aria-label={`Add ${product.name} to bag`}
                      className={`inline-flex items-center justify-center rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors duration-150 cursor-pointer min-h-[40px] min-w-[40px] ${
                        isAdded
                          ? 'bg-[#10B981] text-[#090A0D]'
                          : 'border border-white/[0.12] bg-[#0B0C0F] text-[#F4F4F5] hover:border-[#E2A84B]'
                      }`}
                    >
                      {isAdded ? (
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
