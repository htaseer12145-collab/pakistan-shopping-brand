import { ArrowRight, ShieldCheck } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';
import { ProductCategory } from '../types';
import { ProductImage } from './ProductImage';

interface HeroSectionProps {
  onExploreCategory: (category: ProductCategory) => void;
  onJumpToOffers: () => void;
  onOpenTrackOrder: () => void;
}

export function HeroSection({
  onExploreCategory,
  onJumpToOffers,
  onOpenTrackOrder,
}: HeroSectionProps) {
  const scrollToCatalog = (category: ProductCategory) => {
    onExploreCategory(category);
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="top" className="relative overflow-hidden border-b border-white/[0.08]">
      {/* Cinematic Full-Bleed Backdrop with Measured Contrast Scrim */}
      <div className="relative min-h-[540px] lg:min-h-[620px] flex items-end lg:items-center">
        <div className="absolute inset-0 z-0">
          <ProductImage
            src={HERO_IMAGE}
            alt="Cinematic showcase of matte black smart glasses and titanium smartwatch on dark volcanic slate"
            title="Zayr Select Flagship Collection"
            className="h-full w-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#090A0D]/95 via-[#090A0D]/75 to-[#090A0D]/25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#090A0D] via-transparent to-[#090A0D]/40"
          />
        </div>

        {/* Hero Copy Layer */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-medium tracking-[0.14em] uppercase text-[#E2A84B]">
              Daraz Mall Verified · Amazon Global to Pakistan
            </p>

            <h1 className="font-display text-4xl font-semibold tracking-tight text-[#F4F4F5] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08] [text-wrap:balance]">
              Next-Generation Tech, Delivered Across Pakistan.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#D4D4D8] sm:text-lg">
              Shop authentic Meta Ray-Ban smart glasses, titanium smart watches, studio audio,
              and PTA-approved flagships with nationwide Cash on Delivery, JazzCash, Easypaisa,
              and encrypted card checkout.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToCatalog(ProductCategory.ALL)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#E2A84B] px-6 py-3 text-sm font-semibold text-[#090A0D] hover:bg-[#eab866] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A84B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090A0D]"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToCatalog(ProductCategory.SMART_GLASSES)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.16] bg-[#12141A]/80 px-5 py-3 text-sm font-medium text-[#F4F4F5] hover:border-white/[0.32] hover:bg-[#1A1D26] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A84B]"
              >
                <span>Meta Smart Glasses</span>
              </button>

              <button
                type="button"
                onClick={onJumpToOffers}
                className="text-sm font-medium text-[#D4D4D8] underline decoration-white/30 underline-offset-4 hover:text-[#E2A84B] hover:decoration-[#E2A84B] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer py-2 px-1"
              >
                Discount Codes
              </button>

              <button
                type="button"
                onClick={onOpenTrackOrder}
                className="md:hidden text-sm font-medium text-[#D4D4D8] underline decoration-white/30 underline-offset-4 hover:text-[#E2A84B] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer py-2 px-1"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Proof Strip Directly Below Hero Split */}
      <div className="bg-[#0C0D12] border-t border-white/[0.06]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
              Nationwide Courier
            </p>
            <p className="mt-1 text-sm font-medium text-[#F4F4F5]">
              TCS &amp; Leopards COD · 45+ Cities
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
              Sourcing Channels
            </p>
            <p className="mt-1 text-sm font-medium text-[#F4F4F5]">
              Daraz Mall &amp; Customs-Cleared Amazon
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
              Payment Options
            </p>
            <p className="mt-1 text-sm font-medium text-[#F4F4F5]">
              JazzCash · Easypaisa · Cards · Raast
            </p>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#E2A84B]" />
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                Buyer Protection
              </p>
              <p className="mt-1 text-sm font-medium text-[#F4F4F5]">
                Open-Parcel Check &amp; Sealed Warranty
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
