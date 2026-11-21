import { ShoppingBag } from 'lucide-react';
import { ProductCategory } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTrackOrder: () => void;
  onNavigateCategory: (category: ProductCategory) => void;
}

export function Navbar({
  cartCount,
  onOpenCart,
  onOpenTrackOrder,
  onNavigateCategory,
}: NavbarProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#090A0D]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-lg font-semibold tracking-tight text-[#F4F4F5] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A84B] rounded-sm"
        >
          Zayr Select
        </a>

        {/* Zone 2: Concise Single-Line Text Nav Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#A1A1AA]"
        >
          <button
            type="button"
            onClick={() => {
              onNavigateCategory(ProductCategory.ALL);
              scrollToSection('catalog');
            }}
            className="hover:text-[#F4F4F5] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A84B] rounded-sm py-1"
          >
            Catalog
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateCategory(ProductCategory.SMART_GLASSES);
              scrollToSection('catalog');
            }}
            className="hover:text-[#F4F4F5] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A84B] rounded-sm py-1"
          >
            Smart Glasses
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('offers')}
            className="hover:text-[#F4F4F5] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A84B] rounded-sm py-1"
          >
            Offers
          </button>
          <button
            type="button"
            onClick={onOpenTrackOrder}
            className="hover:text-[#F4F4F5] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A84B] rounded-sm py-1"
          >
            Track Order
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag with ${cartCount} items`}
            className="inline-flex items-center gap-2 rounded-lg bg-[#F4F4F5] px-4 py-2 text-xs font-semibold text-[#090A0D] hover:bg-[#E2A84B] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A84B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090A0D]"
          >
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="font-mono tabular-nums">Bag ({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
