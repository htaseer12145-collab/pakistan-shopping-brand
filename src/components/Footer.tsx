import { ProductCategory } from '../types';

interface FooterProps {
  onNavigateCategory: (category: ProductCategory) => void;
  onOpenTrackOrder: () => void;
  onOpenAffiliateSettings: () => void;
}

export function Footer({
  onNavigateCategory,
  onOpenTrackOrder,
  onOpenAffiliateSettings,
}: FooterProps) {
  const jumpToCatalog = (category: ProductCategory) => {
    onNavigateCategory(category);
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#090A0D]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-sm">
            <span className="font-display text-lg font-semibold tracking-tight text-[#F4F4F5]">
              Zayr Select
            </span>
            <p className="mt-2.5 text-xs leading-relaxed text-[#A1A1AA]">
              Minimalist storefront for smart watches, Meta smart glasses, studio audio, and
              PTA-approved flagships sourced via Daraz Mall &amp; Amazon Global for Pakistan.
            </p>
            <p className="mt-3 text-[11px] leading-relaxed text-[#71717A]">
              Affiliate Disclosure: As an Amazon Associate and Daraz Partner, Zayr Select
              earns commissions from qualifying partner purchases at no extra cost to you.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 text-xs">
            <div>
              <p className="font-medium uppercase tracking-wider text-[#F4F4F5]">
                Categories
              </p>
              <ul className="mt-3 space-y-2 text-[#A1A1AA]">
                <li>
                  <button
                    type="button"
                    onClick={() => jumpToCatalog(ProductCategory.SMART_GLASSES)}
                    className="hover:text-[#F4F4F5] cursor-pointer"
                  >
                    Smart Glasses
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => jumpToCatalog(ProductCategory.SMART_WATCHES)}
                    className="hover:text-[#F4F4F5] cursor-pointer"
                  >
                    Smart Watches
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => jumpToCatalog(ProductCategory.FASHION)}
                    className="hover:text-[#F4F4F5] cursor-pointer"
                  >
                    Fashion &amp; Clothes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => jumpToCatalog(ProductCategory.HOME_KITCHEN)}
                    className="hover:text-[#F4F4F5] cursor-pointer"
                  >
                    Home &amp; Kitchen
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => jumpToCatalog(ProductCategory.BEAUTY)}
                    className="hover:text-[#F4F4F5] cursor-pointer"
                  >
                    Beauty &amp; Fragrances
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium uppercase tracking-wider text-[#F4F4F5]">
                Customer &amp; Partner
              </p>
              <ul className="mt-3 space-y-2 text-[#A1A1AA]">
                <li>
                  <button
                    type="button"
                    onClick={onOpenTrackOrder}
                    className="hover:text-[#F4F4F5] cursor-pointer"
                  >
                    Track Order
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenAffiliateSettings}
                    className="text-[#E2A84B] hover:underline cursor-pointer"
                  >
                    Affiliate IDs &amp; Click Log
                  </button>
                </li>
                <li>
                  <a href="#offers" className="hover:text-[#F4F4F5]">
                    Discount Codes
                  </a>
                </li>
                <li>
                  <span>support@zayrselect.pk</span>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="font-medium uppercase tracking-wider text-[#F4F4F5]">
                Accepted Payments
              </p>
              <p className="mt-3 leading-relaxed text-[#A1A1AA]">
                JazzCash · Easypaisa · SadaPay · NayaPay · Visa · Mastercard · Raast IBFT ·
                Cash on Delivery
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 text-xs text-[#71717A] sm:flex-row sm:items-center">
          <p>© 2026 Zayr Select Pakistan. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/zayr-select-netlify.zip"
              download="zayr-select-netlify.zip"
              className="text-[#E2A84B] hover:underline"
            >
              Download Netlify Bundle (.zip)
            </a>
            <span aria-hidden="true">·</span>
            <p>TLS Encrypted Checkout · Karachi · Lahore · Islamabad</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
