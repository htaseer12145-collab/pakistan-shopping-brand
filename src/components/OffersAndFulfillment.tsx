import { Check, Lock, ShieldCheck, Tag, Truck } from 'lucide-react';
import { PROMO_OFFERS, formatPkr } from '../data/products';

interface OffersAndFulfillmentProps {
  appliedPromoCode: string | null;
  onApplyPromoCode: (code: string) => void;
  onOpenAffiliateSettings: () => void;
}

export function OffersAndFulfillment({
  appliedPromoCode,
  onApplyPromoCode,
  onOpenAffiliateSettings,
}: OffersAndFulfillmentProps) {
  return (
    <section
      id="offers"
      className="border-t border-white/[0.08] bg-[#0C0D12]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column: Active Discount Offers */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#E2A84B]">
                Seasonal Savings &amp; Bundles
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#F4F4F5] sm:text-3xl [text-wrap:balance]">
                Verified Discount Offers for Pakistan Orders
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">
                Apply an instant checkout code below alongside already discounted retail pricing
                on smart watches, Meta Ray-Ban glasses, and audio gear.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {PROMO_OFFERS.map((offer) => {
                const isApplied = appliedPromoCode === offer.code;
                return (
                  <div
                    key={offer.code}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#12141A] p-5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 text-xs font-mono text-[#E2A84B]">
                        <Tag className="h-3.5 w-3.5" />
                        <span className="font-semibold tracking-wider">{offer.code}</span>
                        <span className="text-[#71717A]">·</span>
                        <span className="text-[#A1A1AA]">
                          Min {formatPkr(offer.minOrderPkr)}
                        </span>
                      </div>
                      <h3 className="mt-1.5 font-display text-base font-semibold text-[#F4F4F5]">
                        {offer.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#A1A1AA]">{offer.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onApplyPromoCode(offer.code)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
                        isApplied
                          ? 'bg-[#10B981] text-[#090A0D]'
                          : 'bg-[#F4F4F5] text-[#090A0D] hover:bg-[#E2A84B]'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                          <span>Applied to Bag</span>
                        </>
                      ) : (
                        <span>Apply Code</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Daraz / Amazon Sourcing & Security */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#12141A] p-6 sm:p-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#A1A1AA]">
                Fulfillment &amp; Checkout Security
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-[#F4F4F5] sm:text-2xl">
                Built for Effortless Buying in Pakistan
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">
                Every device is sourced directly through verified Daraz Mall Flagship stores or
                customs-cleared Amazon Global express channels, eliminating hidden duties or
                unverified gray-market listings.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-white/[0.08] pt-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#E2A84B]" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F4F4F5]">
                    Daraz &amp; Amazon Direct
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#A1A1AA]">
                    1–3 day TCS/Leopards delivery for local stock; 4–7 day customs-cleared
                    air express for Meta &amp; MacBooks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#E2A84B]" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F4F4F5]">
                    Encrypted Checkout
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#A1A1AA]">
                    256-bit TLS verified checkout supporting JazzCash, Easypaisa, SadaPay,
                    Visa/Mastercard, Raast IBFT, and COD.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#E2A84B]" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F4F4F5]">
                    Open-Parcel Inspection
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#A1A1AA]">
                    Verify factory seal and serial authenticity with our courier rider on
                    Cash on Delivery orders before paying.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#E2A84B]" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F4F4F5]">
                    Free Delivery Above 15K
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#A1A1AA]">
                    Insured shipping across Karachi, Lahore, Islamabad, Rawalpindi,
                    Faisalabad, Multan, and Peshawar.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5 text-xs">
              <span className="text-[#A1A1AA]">
                Store Owner? Track referral commissions via Daraz &amp; Amazon links.
              </span>
              <button
                type="button"
                onClick={onOpenAffiliateSettings}
                className="font-semibold text-[#E2A84B] hover:underline whitespace-nowrap cursor-pointer"
              >
                Configure Affiliate IDs &amp; Click Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
