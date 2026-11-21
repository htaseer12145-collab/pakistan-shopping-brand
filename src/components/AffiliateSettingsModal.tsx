import { useEffect, useState } from 'react';
import { ExternalLink, Link2, RotateCcw, Trash2, X } from 'lucide-react';
import { DEFAULT_AFFILIATE_CONFIG, PRODUCTS, buildAffiliateUrl, formatPkr } from '../data/products';
import { AffiliateClickEvent, AffiliateConfig } from '../types';

interface AffiliateSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AffiliateConfig;
  onSaveConfig: (next: AffiliateConfig) => void;
  clickLog: AffiliateClickEvent[];
  onClearClickLog: () => void;
}

export function AffiliateSettingsModal({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  clickLog,
  onClearClickLog,
}: AffiliateSettingsModalProps) {
  const [darazId, setDarazId] = useState(config.darazAffiliateId);
  const [amazonTag, setAmazonTag] = useState(config.amazonAssociateTag);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDarazId(config.darazAffiliateId);
      setAmazonTag(config.amazonAssociateTag);
      setSavedFeedback(false);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const sampleProduct = PRODUCTS[0];
  const previewConfig: AffiliateConfig = {
    darazAffiliateId: darazId.trim() || DEFAULT_AFFILIATE_CONFIG.darazAffiliateId,
    amazonAssociateTag: amazonTag.trim() || DEFAULT_AFFILIATE_CONFIG.amazonAssociateTag,
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(previewConfig);
    setSavedFeedback(true);
    window.setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleReset = () => {
    setDarazId(DEFAULT_AFFILIATE_CONFIG.darazAffiliateId);
    setAmazonTag(DEFAULT_AFFILIATE_CONFIG.amazonAssociateTag);
    onSaveConfig(DEFAULT_AFFILIATE_CONFIG);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="affiliate-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/[0.1] bg-[#12141A] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#E2A84B]">
              Partner Commission Configuration
            </p>
            <h2
              id="affiliate-modal-title"
              className="mt-1 font-display text-xl font-semibold text-[#F4F4F5]"
            >
              Daraz &amp; Amazon Affiliate Tracking IDs
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close partner settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-[#0B0C0F] text-[#A1A1AA] hover:text-[#F4F4F5] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="daraz-aff-id"
                className="block text-xs font-medium text-[#D4D4D8] mb-1.5"
              >
                Daraz Affiliate ID / Sub-ID
              </label>
              <input
                id="daraz-aff-id"
                type="text"
                value={darazId}
                onChange={(e) => setDarazId(e.target.value)}
                placeholder="e.g. zayr_daraz_pk"
                className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#0B0C0F] px-3 font-mono text-xs text-[#F4F4F5] focus:border-[#E2A84B] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="amazon-tag"
                className="block text-xs font-medium text-[#D4D4D8] mb-1.5"
              >
                Amazon Associates Store Tag
              </label>
              <input
                id="amazon-tag"
                type="text"
                value={amazonTag}
                onChange={(e) => setAmazonTag(e.target.value)}
                placeholder="e.g. zayrselect-20"
                className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#0B0C0F] px-3 font-mono text-xs text-[#F4F4F5] focus:border-[#E2A84B] focus:outline-none"
              />
            </div>
          </div>

          {/* Live Link Preview */}
          <div className="rounded-lg border border-white/[0.08] bg-[#0B0C0F] p-4 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 font-medium text-[#F4F4F5]">
              <Link2 className="h-3.5 w-3.5 text-[#E2A84B]" />
              <span>Live Commission Link Preview ({sampleProduct.name})</span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px] text-[#A1A1AA] break-all">
              <p>
                <span className="text-[#E2A84B]">Daraz:</span>{' '}
                {buildAffiliateUrl(sampleProduct, 'daraz', previewConfig)}
              </p>
              <p>
                <span className="text-[#E2A84B]">Amazon:</span>{' '}
                {buildAffiliateUrl(sampleProduct, 'amazon', previewConfig)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3.5 py-2 text-xs font-medium text-[#A1A1AA] hover:text-[#F4F4F5] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#E2A84B] px-5 py-2.5 text-xs font-semibold text-[#090A0D] hover:bg-[#eab866] transition-colors cursor-pointer min-h-[40px]"
            >
              {savedFeedback ? 'Affiliate IDs Saved' : 'Save & Update All Product Links'}
            </button>
          </div>
        </form>

        {/* Outbound Referral Click Log */}
        <div className="mt-8 border-t border-white/[0.08] pt-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-sm font-semibold text-[#F4F4F5]">
                Outbound Affiliate Click Log ({clickLog.length})
              </h3>
              <p className="mt-0.5 text-xs text-[#A1A1AA]">
                Tracks when visitors click &ldquo;Buy on Daraz.pk&rdquo; or &ldquo;Buy on Amazon&rdquo;.
              </p>
            </div>
            {clickLog.length > 0 && (
              <button
                type="button"
                onClick={onClearClickLog}
                className="inline-flex items-center gap-1 text-xs text-[#A1A1AA] hover:text-red-400 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Log</span>
              </button>
            )}
          </div>

          {clickLog.length === 0 ? (
            <p className="mt-4 rounded-lg border border-white/[0.06] bg-[#0B0C0F] p-4 text-xs text-[#71717A]">
              No outbound marketplace redirects logged yet. Click any &ldquo;Buy on Daraz.pk&rdquo; or
              &ldquo;Buy on Amazon&rdquo; button to test referral tracking.
            </p>
          ) : (
            <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto pr-1">
              {clickLog.slice(0, 12).map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-[#0B0C0F] px-3.5 py-2.5 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[#F4F4F5] truncate">
                      {entry.productName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#A1A1AA]">
                      {entry.partner === 'daraz' ? 'Daraz.pk' : 'Amazon'} ·{' '}
                      {entry.commissionRate}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 font-mono text-[#E2A84B]">
                      {formatPkr(entry.pricePkr)}
                      <ExternalLink className="h-3 w-3" />
                    </span>
                    <p className="mt-0.5 font-mono text-[10px] text-[#71717A]">
                      {new Date(entry.clickedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
