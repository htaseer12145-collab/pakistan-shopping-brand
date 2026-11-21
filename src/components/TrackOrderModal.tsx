import { useEffect, useState } from 'react';
import { Check, Package, Search, Truck, X } from 'lucide-react';
import { formatPkr } from '../data/products';
import { OrderRecord } from '../types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  initialOrderId?: string | null;
}

const SHIPMENT_STEPS = [
  { label: 'Order Verified', detail: 'Payment / COD confirmation & security check passed' },
  { label: 'Quality & Seal Check', detail: 'Factory seal & serial/PTA verification completed' },
  { label: 'Dispatched via Courier', detail: 'Handed to express courier hub for intercity transit' },
  { label: 'Out for Delivery', detail: 'Rider assigned with open-parcel inspection PIN' },
];

export function TrackOrderModal({
  isOpen,
  onClose,
  orders,
  initialOrderId,
}: TrackOrderModalProps) {
  const [queryId, setQueryId] = useState(initialOrderId || orders[0]?.orderId || 'ZYR-202641');
  const [searchedId, setSearchedId] = useState(
    initialOrderId || orders[0]?.orderId || 'ZYR-202641'
  );

  useEffect(() => {
    if (isOpen) {
      const targetId = initialOrderId || orders[0]?.orderId || 'ZYR-202641';
      setQueryId(targetId);
      setSearchedId(targetId);
    }
  }, [isOpen, initialOrderId, orders]);

  if (!isOpen) return null;

  const matchedOrder = orders.find(
    (o) => o.orderId.toLowerCase() === searchedId.trim().toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(queryId);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="track-order-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/[0.1] bg-[#12141A] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#E2A84B]">
              Shipment Verification
            </p>
            <h2
              id="track-order-title"
              className="mt-1 font-display text-xl font-semibold text-[#F4F4F5]"
            >
              Track Your Pakistan Order
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order tracker"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-[#0B0C0F] text-[#A1A1AA] hover:text-[#F4F4F5] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
            <input
              type="text"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              placeholder="Enter Order ID (e.g. ZYR-202641)"
              className="h-11 w-full rounded-lg border border-white/[0.1] bg-[#0B0C0F] pl-10 pr-4 font-mono text-sm text-[#F4F4F5] placeholder:text-[#71717A] focus:border-[#E2A84B] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#F4F4F5] px-5 py-2.5 text-xs font-semibold text-[#090A0D] hover:bg-[#E2A84B] transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
          >
            Check Status
          </button>
        </form>

        {/* Quick Order Switcher for Recent Orders */}
        {orders.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#A1A1AA]">
            <span>Recent orders:</span>
            {orders.slice(0, 4).map((order) => (
              <button
                key={order.orderId}
                type="button"
                onClick={() => {
                  setQueryId(order.orderId);
                  setSearchedId(order.orderId);
                }}
                className={`rounded-md px-2.5 py-1 font-mono transition-colors cursor-pointer ${
                  matchedOrder?.orderId === order.orderId
                    ? 'bg-[#E2A84B]/20 text-[#E2A84B]'
                    : 'bg-[#0B0C0F] text-[#D4D4D8] hover:text-[#F4F4F5]'
                }`}
              >
                {order.orderId}
              </button>
            ))}
          </div>
        )}

        {matchedOrder ? (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/[0.08] bg-[#0B0C0F] p-4 sm:grid-cols-4 text-xs">
              <div>
                <span className="text-[#71717A]">Order ID</span>
                <p className="mt-0.5 font-mono font-semibold text-[#F4F4F5]">
                  {matchedOrder.orderId}
                </p>
              </div>
              <div>
                <span className="text-[#71717A]">Destination</span>
                <p className="mt-0.5 font-medium text-[#F4F4F5]">{matchedOrder.city}</p>
              </div>
              <div>
                <span className="text-[#71717A]">Courier</span>
                <p className="mt-0.5 font-medium text-[#F4F4F5]">{matchedOrder.courier}</p>
              </div>
              <div>
                <span className="text-[#71717A]">Total Paid / Due</span>
                <p className="mt-0.5 font-mono font-semibold tabular-nums text-[#E2A84B]">
                  {formatPkr(matchedOrder.totalPkr)}
                </p>
              </div>
            </div>

            {/* Shipment Steps */}
            <div className="space-y-3">
              {SHIPMENT_STEPS.map((step, index) => {
                const completed = index <= matchedOrder.statusStep;
                const current = index === matchedOrder.statusStep;
                return (
                  <div
                    key={step.label}
                    className={`flex items-start gap-3.5 rounded-lg border p-3.5 ${
                      completed
                        ? 'border-white/[0.12] bg-[#0B0C0F]'
                        : 'border-white/[0.04] bg-[#0B0C0F]/40 opacity-60'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                        completed
                          ? 'bg-[#E2A84B] text-[#090A0D]'
                          : 'border border-white/[0.12] text-[#71717A]'
                      }`}
                    >
                      {completed ? (
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      ) : (
                        <Truck className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-[#F4F4F5]">{step.label}</p>
                        {current && (
                          <span className="font-mono text-[11px] uppercase text-[#E2A84B]">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-[#A1A1AA]">{step.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Item Summary */}
            <div className="border-t border-white/[0.08] pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
                Items in Shipment
              </p>
              <div className="mt-2.5 space-y-2">
                {matchedOrder.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variant}`}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-[#D4D4D8]">
                      {item.quantity}× {item.name}{' '}
                      <span className="text-[#71717A]">({item.variant})</span>
                    </span>
                    <span className="font-mono tabular-nums text-[#F4F4F5]">
                      {formatPkr(item.unitPricePkr * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-[#71717A]">
                Payment: {matchedOrder.paymentLabel} · Recipient: {matchedOrder.customerName} (
                {matchedOrder.phone})
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#0B0C0F] p-8 text-center">
            <Package className="mx-auto h-7 w-7 text-[#71717A]" />
            <p className="mt-3 text-sm font-medium text-[#F4F4F5]">
              No order found matching &ldquo;{searchedId}&rdquo;
            </p>
            <p className="mt-1 text-xs text-[#A1A1AA]">
              Check your order ID or try sample order ZYR-202641.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
