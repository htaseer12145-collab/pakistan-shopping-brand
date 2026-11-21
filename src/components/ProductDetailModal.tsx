import { useEffect, useState } from 'react';
import { Check, ExternalLink, Minus, Plus, ShieldCheck, Truck, X } from 'lucide-react';
import { buildAffiliateUrl, formatPkr } from '../data/products';
import { AffiliateConfig, AffiliatePartner, Product } from '../types';
import { ProductImage } from './ProductImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant: string, quantity: number) => void;
  affiliateConfig: AffiliateConfig;
  onTrackAffiliateClick: (product: Product, partner: AffiliatePartner) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  affiliateConfig,
  onTrackAffiliateClick,
}: ProductDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0] || 'Standard');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

  const savings = product.originalPricePkr - product.pricePkr;
  const darazUrl = buildAffiliateUrl(product, 'daraz', affiliateConfig);
  const amazonUrl = buildAffiliateUrl(product, 'amazon', affiliateConfig);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-white/[0.1] bg-[#12141A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-[#090A0D]/80 text-[#D4D4D8] hover:border-white/[0.24] hover:text-[#F4F4F5] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Product Imagery */}
          <div className="bg-[#0B0C0F] p-6 lg:col-span-6 flex flex-col justify-between">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/[0.06]">
              <ProductImage
                src={product.image}
                alt={`${product.brand} ${product.name}`}
                title={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4 text-xs">
              <div className="flex items-start gap-2 text-[#A1A1AA]">
                <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E2A84B]" />
                <div>
                  <span className="block font-medium text-[#F4F4F5]">
                    {product.sourceChannel}
                  </span>
                  <span>{product.deliveryEstimate}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-[#A1A1AA]">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E2A84B]" />
                <div>
                  <span className="block font-medium text-[#F4F4F5]">
                    Protected Purchase
                  </span>
                  <span>{product.warranty}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 lg:col-span-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
                {product.brand} · {product.category} · {product.stockStatus}
              </p>

              <h2
                id="pdp-title"
                className="mt-2 font-display text-2xl font-semibold text-[#F4F4F5]"
              >
                {product.name}
              </h2>

              <div className="mt-4 flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-2xl font-semibold tabular-nums text-[#F4F4F5]">
                  {formatPkr(product.pricePkr)}
                </span>
                {savings > 0 && (
                  <>
                    <span className="font-mono text-sm tabular-nums text-[#71717A] line-through">
                      {formatPkr(product.originalPricePkr)}
                    </span>
                    <span className="font-mono text-xs font-medium tabular-nums text-[#E2A84B]">
                      Save {formatPkr(savings)} (-{product.discountPercent}%)
                    </span>
                  </>
                )}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#D4D4D8]">
                {product.description}
              </p>

              {/* Variant Selector */}
              <div className="mt-6">
                <span className="block text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
                  Select Configuration
                </span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const active = selectedVariant === variant;
                    return (
                      <button
                        key={variant}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer min-h-[38px] ${
                          active
                            ? 'border-[#E2A84B] bg-[#E2A84B]/15 text-[#F4F4F5]'
                            : 'border-white/[0.1] bg-[#0B0C0F] text-[#A1A1AA] hover:text-[#F4F4F5]'
                        }`}
                      >
                        {active && <Check className="h-3 w-3 text-[#E2A84B]" />}
                        <span>{variant}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="mt-6 border-t border-white/[0.08] pt-5">
                <span className="block text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
                  Key Specifications
                </span>
                <dl className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-lg border border-white/[0.06] bg-[#0B0C0F] px-3 py-2"
                    >
                      <dt className="text-[11px] text-[#71717A]">{spec.label}</dt>
                      <dd className="mt-0.5 text-xs font-medium text-[#F4F4F5]">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Direct Partner Affiliate Links + Add to Bag */}
            <div className="mt-7 space-y-3 border-t border-white/[0.08] pt-5">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <a
                  href={darazUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() => onTrackAffiliateClick(product, 'daraz')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E2A84B] px-4 py-3 text-xs font-semibold text-[#090A0D] hover:bg-[#eab866] transition-colors whitespace-nowrap min-h-[44px]"
                >
                  <span>Buy Direct on Daraz.pk</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>

                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() => onTrackAffiliateClick(product, 'amazon')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.16] bg-[#0B0C0F] px-4 py-3 text-xs font-semibold text-[#F4F4F5] hover:border-[#E2A84B] hover:text-[#E2A84B] transition-colors whitespace-nowrap min-h-[44px]"
                >
                  <span>Buy Direct on Amazon</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-white/[0.1] bg-[#0B0C0F]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-11 w-10 items-center justify-center text-[#A1A1AA] hover:text-[#F4F4F5] cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono text-sm font-medium tabular-nums text-[#F4F4F5]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                    className="flex h-11 w-10 items-center justify-center text-[#A1A1AA] hover:text-[#F4F4F5] cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, selectedVariant || product.variants[0], quantity);
                    onClose();
                  }}
                  className="flex-1 rounded-lg bg-[#F4F4F5] px-5 py-3 text-xs font-semibold text-[#090A0D] hover:bg-white transition-colors duration-150 whitespace-nowrap cursor-pointer min-h-[44px]"
                >
                  Or Add to Zayr Bag · {formatPkr(product.pricePkr * quantity)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
