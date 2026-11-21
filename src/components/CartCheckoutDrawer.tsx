import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Banknote,
  Building2,
  Check,
  CreditCard,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  Smartphone,
  Trash2,
  X,
} from 'lucide-react';
import { PAKISTAN_CITIES, PROMO_OFFERS, formatPkr } from '../data/products';
import { CartItem, OrderRecord, PaymentMethod } from '../types';
import { ProductImage } from './ProductImage';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, variant: string, delta: number) => void;
  onRemoveItem: (productId: string, variant: string) => void;
  appliedPromoCode: string | null;
  onApplyPromoCode: (code: string | null) => void;
  onOrderComplete: (order: OrderRecord) => void;
  onTrackOrder: (orderId: string) => void;
}

type DrawerStep = 'bag' | 'checkout' | 'receipt';

const FREE_DELIVERY_THRESHOLD = 15000;
const STANDARD_DELIVERY_FEE = 350;

export function CartCheckoutDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  appliedPromoCode,
  onApplyPromoCode,
  onOrderComplete,
  onTrackOrder,
}: CartCheckoutDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('bag');
  const [promoInput, setPromoInput] = useState(appliedPromoCode || '');
  const [promoError, setPromoError] = useState('');

  // Shipping form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(PAKISTAN_CITIES[0]);
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.JAZZCASH_EASYPAISA
  );
  const [walletProvider, setWalletProvider] = useState<'JazzCash' | 'Easypaisa'>('JazzCash');
  const [walletPhone, setWalletPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [raastRef, setRaastRef] = useState('');
  const [codAccepted, setCodAccepted] = useState(true);

  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (appliedPromoCode) {
      setPromoInput(appliedPromoCode);
      setPromoError('');
    }
  }, [appliedPromoCode]);

  useEffect(() => {
    if (!isOpen && step === 'receipt') {
      setStep('bag');
      setCompletedOrder(null);
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  const subtotalPkr = items.reduce(
    (sum, item) => sum + item.product.pricePkr * item.quantity,
    0
  );

  const activeOffer = PROMO_OFFERS.find((o) => o.code === appliedPromoCode);
  const discountPkr =
    activeOffer && subtotalPkr >= activeOffer.minOrderPkr
      ? activeOffer.type === 'percent'
        ? Math.round((subtotalPkr * activeOffer.value) / 100)
        : activeOffer.value
      : 0;

  const deliveryFeePkr =
    subtotalPkr === 0 || subtotalPkr >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;

  const totalPkr = Math.max(0, subtotalPkr - discountPkr + deliveryFeePkr);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) {
      onApplyPromoCode(null);
      setPromoError('');
      return;
    }
    const found = PROMO_OFFERS.find((o) => o.code === cleaned);
    if (!found) {
      setPromoError('Invalid code. Try ZAYR10 or SAVE5000.');
      return;
    }
    if (subtotalPkr < found.minOrderPkr) {
      setPromoError(`Minimum order of ${formatPkr(found.minOrderPkr)} required for ${found.code}.`);
      return;
    }
    setPromoError('');
    onApplyPromoCode(found.code);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const validateAndSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (customerName.trim().length < 3) {
      setFormError('Please enter your full name for courier verification.');
      return;
    }
    const normalizedPhone = phone.replace(/\D/g, '');
    if (!/^03\d{9}$/.test(normalizedPhone)) {
      setFormError('Enter a valid 11-digit Pakistan mobile number starting with 03 (e.g. 03001234567).');
      return;
    }
    if (address.trim().length < 8) {
      setFormError('Please enter a complete street address and house/office number.');
      return;
    }

    let paymentLabel = '';
    if (paymentMethod === PaymentMethod.JAZZCASH_EASYPAISA) {
      const wDigits = walletPhone.replace(/\D/g, '');
      if (!/^03\d{9}$/.test(wDigits)) {
        setFormError(`Enter a valid 11-digit ${walletProvider} mobile account number.`);
        return;
      }
      paymentLabel = `${walletProvider} Wallet (${wDigits.slice(0, 4)}-XXXX${wDigits.slice(-3)})`;
    } else if (paymentMethod === PaymentMethod.CARD) {
      const cDigits = cardNumber.replace(/\D/g, '');
      if (cDigits.length < 16) {
        setFormError('Please enter a complete 16-digit Visa, Mastercard, SadaPay, or NayaPay card number.');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setFormError('Enter card expiry in MM/YY format.');
        return;
      }
      if (!/^\d{3,4}$/.test(cardCvv)) {
        setFormError('Enter a valid 3 or 4 digit security CVV.');
        return;
      }
      paymentLabel = `Encrypted Card ending in ${cDigits.slice(-4)}`;
    } else if (paymentMethod === PaymentMethod.RAAST_IBFT) {
      if (raastRef.trim().length < 4) {
        setFormError('Enter your Raast / IBFT transaction reference or last 4 digits of sender IBAN.');
        return;
      }
      paymentLabel = `Raast / IBFT Transfer (Ref: ${raastRef.trim().toUpperCase()})`;
    } else {
      if (!codAccepted) {
        setFormError('Please confirm Cash on Delivery terms before placing order.');
        return;
      }
      paymentLabel = 'Cash on Delivery (Open-Parcel Verified)';
    }

    setIsProcessing(true);
    window.setTimeout(() => {
      const orderId = `ZYR-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: OrderRecord = {
        orderId,
        createdAt: new Date().toISOString(),
        customerName: customerName.trim(),
        phone: `${normalizedPhone.slice(0, 4)}-${normalizedPhone.slice(4)}`,
        city,
        address: `${address.trim()}${postalCode.trim() ? `, ${postalCode.trim()}` : ''}`,
        paymentMethod,
        paymentLabel,
        courier: city === 'Karachi' || city === 'Lahore' || city === 'Islamabad'
          ? 'TCS Express Air'
          : 'Leopards Insured Express',
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          variant: item.variant,
          quantity: item.quantity,
          unitPricePkr: item.product.pricePkr,
        })),
        subtotalPkr,
        discountPkr,
        deliveryFeePkr,
        totalPkr,
        promoCode: discountPkr > 0 && activeOffer ? activeOffer.code : undefined,
        statusStep: 0,
      };

      setIsProcessing(false);
      setCompletedOrder(newOrder);
      onOrderComplete(newOrder);
      setStep('receipt');
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Secure Checkout"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-lg flex-col border-l border-white/[0.1] bg-[#101218] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                aria-label="Back to shopping bag"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.1] text-[#D4D4D8] hover:text-[#F4F4F5] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <h2 className="font-display text-lg font-semibold text-[#F4F4F5]">
                {step === 'bag' && 'Your Shopping Bag'}
                {step === 'checkout' && 'Secure Pakistan Checkout'}
                {step === 'receipt' && 'Order Confirmed'}
              </h2>
              {step === 'checkout' && (
                <p className="flex items-center gap-1.5 text-[11px] text-[#A1A1AA]">
                  <Lock className="h-3 w-3 text-[#E2A84B]" />
                  <span>256-Bit Encrypted · Verified Fulfillment</span>
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-[#090A0D] text-[#A1A1AA] hover:text-[#F4F4F5] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'bag' && (
            <>
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <p className="font-display text-lg font-medium text-[#F4F4F5]">
                    Your bag is currently empty
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-[#A1A1AA]">
                    Explore Meta smart glasses, titanium watches, and audio gear delivered
                    across Pakistan.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 rounded-lg bg-[#F4F4F5] px-5 py-2.5 text-xs font-semibold text-[#090A0D] hover:bg-[#E2A84B] transition-colors cursor-pointer"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Free Delivery Progress */}
                  <div className="rounded-lg border border-white/[0.08] bg-[#0B0C0F] px-4 py-3 text-xs">
                    {subtotalPkr >= FREE_DELIVERY_THRESHOLD ? (
                      <p className="flex items-center gap-2 font-medium text-[#10B981]">
                        <Check className="h-4 w-4 shrink-0" />
                        <span>Unlocked Free Insured Courier Delivery Across Pakistan</span>
                      </p>
                    ) : (
                      <p className="text-[#D4D4D8]">
                        Add{' '}
                        <span className="font-mono font-semibold text-[#E2A84B]">
                          {formatPkr(FREE_DELIVERY_THRESHOLD - subtotalPkr)}
                        </span>{' '}
                        more for Free Nationwide Express Delivery.
                      </p>
                    )}
                  </div>

                  {/* Itemized List */}
                  <ul className="divide-y divide-white/[0.08]">
                    {items.map((item) => (
                      <li
                        key={`${item.product.id}-${item.variant}`}
                        className="flex gap-4 py-4 first:pt-0"
                      >
                        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0B0C0F]">
                          <ProductImage
                            src={item.product.image}
                            alt={item.product.name}
                            title={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-[#A1A1AA]">
                                {item.product.brand}
                              </p>
                              <h3 className="text-sm font-semibold text-[#F4F4F5] line-clamp-1">
                                {item.product.name}
                              </h3>
                              <p className="mt-0.5 text-xs text-[#71717A]">{item.variant}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                onRemoveItem(item.product.id, item.variant)
                              }
                              aria-label={`Remove ${item.product.name}`}
                              className="p-1 text-[#71717A] hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center rounded-md border border-white/[0.1] bg-[#0B0C0F]">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(item.product.id, item.variant, -1)
                                }
                                aria-label="Decrease quantity"
                                className="flex h-7 w-7 items-center justify-center text-[#A1A1AA] hover:text-[#F4F4F5] cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center font-mono text-xs tabular-nums text-[#F4F4F5]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(item.product.id, item.variant, 1)
                                }
                                aria-label="Increase quantity"
                                className="flex h-7 w-7 items-center justify-center text-[#A1A1AA] hover:text-[#F4F4F5] cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <span className="font-mono text-sm font-semibold tabular-nums text-[#F4F4F5]">
                              {formatPkr(item.product.pricePkr * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Promo Code Input */}
                  <form
                    onSubmit={handleApplyPromo}
                    className="border-t border-white/[0.08] pt-5"
                  >
                    <label
                      htmlFor="promo-code-input"
                      className="block text-xs font-medium text-[#A1A1AA]"
                    >
                      Discount Promo Code (Try ZAYR10 or SAVE5000)
                    </label>
                    <div className="mt-2 flex gap-2">
                      <input
                        id="promo-code-input"
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Enter code"
                        className="h-10 flex-1 rounded-lg border border-white/[0.1] bg-[#0B0C0F] px-3 font-mono text-xs uppercase text-[#F4F4F5] placeholder:normal-case placeholder:text-[#71717A] focus:border-[#E2A84B] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-white/[0.14] bg-[#171A22] px-4 py-2 text-xs font-medium text-[#F4F4F5] hover:border-[#E2A84B] transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="mt-1.5 text-xs text-red-400">{promoError}</p>
                    )}
                    {discountPkr > 0 && activeOffer && (
                      <p className="mt-1.5 flex items-center justify-between text-xs text-[#10B981]">
                        <span>
                          Code {activeOffer.code} active (-{formatPkr(discountPkr)})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onApplyPromoCode(null);
                            setPromoInput('');
                          }}
                          className="underline hover:text-[#F4F4F5] cursor-pointer"
                        >
                          Remove
                        </button>
                      </p>
                    )}
                  </form>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form
              id="secure-checkout-form"
              onSubmit={validateAndSubmitOrder}
              className="space-y-6"
            >
              {/* Shipping Information */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#E2A84B]">
                  1. Delivery Details (Pakistan)
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="chk-name"
                      className="block text-xs text-[#A1A1AA] mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="chk-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ayesha Khan"
                      className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#0B0C0F] px-3 text-sm text-[#F4F4F5] placeholder:text-[#71717A] focus:border-[#E2A84B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="chk-phone"
                      className="block text-xs text-[#A1A1AA] mb-1"
                    >
                      Mobile Number (03XX)
                    </label>
                    <input
                      id="chk-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03001234567"
                      className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#0B0C0F] px-3 font-mono text-sm text-[#F4F4F5] placeholder:text-[#71717A] focus:border-[#E2A84B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="chk-city"
                      className="block text-xs text-[#A1A1AA] mb-1"
                    >
                      City
                    </label>
                    <select
                      id="chk-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#0B0C0F] px-3 text-sm text-[#F4F4F5] focus:border-[#E2A84B] focus:outline-none"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="chk-address"
                      className="block text-xs text-[#A1A1AA] mb-1"
                    >
                      Street Address &amp; Sector / Block
                    </label>
                    <input
                      id="chk-address"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House 14, Street 6, DHA Phase 5"
                      className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#0B0C0F] px-3 text-sm text-[#F4F4F5] placeholder:text-[#71717A] focus:border-[#E2A84B] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="chk-postal"
                      className="block text-xs text-[#A1A1AA] mb-1"
                    >
                      Postal Code (Optional)
                    </label>
                    <input
                      id="chk-postal"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 54000"
                      className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#0B0C0F] px-3 font-mono text-sm text-[#F4F4F5] placeholder:text-[#71717A] focus:border-[#E2A84B] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="border-t border-white/[0.08] pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#E2A84B]">
                  2. Select Payment Option
                </h3>

                <div className="mt-3 grid grid-cols-1 gap-2.5">
                  {[
                    {
                      id: PaymentMethod.JAZZCASH_EASYPAISA,
                      title: 'JazzCash / Easypaisa Mobile Wallet',
                      subtitle: 'Instant 1-tap MPIN prompt on your phone',
                      icon: Smartphone,
                    },
                    {
                      id: PaymentMethod.CARD,
                      title: 'Visa / Mastercard / SadaPay / NayaPay',
                      subtitle: '3D-Secure encrypted debit & credit card checkout',
                      icon: CreditCard,
                    },
                    {
                      id: PaymentMethod.RAAST_IBFT,
                      title: 'Raast / Bank IBFT Transfer',
                      subtitle: 'Zero-fee instant transfer via HBL, Meezan, Alfalah',
                      icon: Building2,
                    },
                    {
                      id: PaymentMethod.COD,
                      title: 'Cash on Delivery (COD)',
                      subtitle: 'Pay rider after open-parcel seal verification',
                      icon: Banknote,
                    },
                  ].map((method) => {
                    const Icon = method.icon;
                    const active = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-start gap-3 rounded-lg border p-3.5 text-left transition-colors cursor-pointer ${
                          active
                            ? 'border-[#E2A84B] bg-[#E2A84B]/10'
                            : 'border-white/[0.08] bg-[#0B0C0F] hover:border-white/[0.2]'
                        }`}
                      >
                        <Icon
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            active ? 'text-[#E2A84B]' : 'text-[#A1A1AA]'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[#F4F4F5]">
                            {method.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#A1A1AA]">
                            {method.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Contextual Payment Fields */}
                <div className="mt-4 rounded-lg border border-white/[0.08] bg-[#0B0C0F] p-4">
                  {paymentMethod === PaymentMethod.JAZZCASH_EASYPAISA && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {(['JazzCash', 'Easypaisa'] as const).map((provider) => (
                          <button
                            key={provider}
                            type="button"
                            onClick={() => setWalletProvider(provider)}
                            className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors cursor-pointer ${
                              walletProvider === provider
                                ? 'bg-[#F4F4F5] text-[#090A0D]'
                                : 'bg-[#12141A] text-[#A1A1AA]'
                            }`}
                          >
                            {provider}
                          </button>
                        ))}
                      </div>
                      <div>
                        <label
                          htmlFor="wallet-phone"
                          className="block text-xs text-[#A1A1AA] mb-1"
                        >
                          {walletProvider} Registered Number
                        </label>
                        <input
                          id="wallet-phone"
                          type="tel"
                          value={walletPhone}
                          onChange={(e) => setWalletPhone(e.target.value)}
                          placeholder="03XX1234567"
                          className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#12141A] px-3 font-mono text-sm text-[#F4F4F5] placeholder:text-[#71717A] focus:border-[#E2A84B] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === PaymentMethod.CARD && (
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="card-num"
                          className="block text-xs text-[#A1A1AA] mb-1"
                        >
                          Card Number (Visa / Mastercard / SadaPay / NayaPay)
                        </label>
                        <input
                          id="card-num"
                          type="text"
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="4242 4242 4242 4242"
                          className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#12141A] px-3 font-mono text-sm text-[#F4F4F5] placeholder:text-[#71717A] focus:border-[#E2A84B] focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="card-exp"
                            className="block text-xs text-[#A1A1AA] mb-1"
                          >
                            Expiry (MM/YY)
                          </label>
                          <input
                            id="card-exp"
                            type="text"
                            inputMode="numeric"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="08/29"
                            className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#12141A] px-3 font-mono text-sm text-[#F4F4F5] placeholder:text-[#71717A] focus:border-[#E2A84B] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="card-cvv"
                            className="block text-xs text-[#A1A1AA] mb-1"
                          >
                            CVV
                          </label>
                          <input
                            id="card-cvv"
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) =>
                              setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                            }
                            placeholder="•••"
                            className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#12141A] px-3 font-mono text-sm text-[#F4F4F5] placeholder:text-[#71717A] focus:border-[#E2A84B] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === PaymentMethod.RAAST_IBFT && (
                    <div className="space-y-3 text-xs">
                      <div className="rounded-md border border-white/[0.06] bg-[#12141A] p-3">
                        <p className="text-[#A1A1AA]">Zayr Select Verified Raast IBAN</p>
                        <p className="mt-1 font-mono font-semibold text-[#F4F4F5]">
                          PK36 MEZN 0002 1101 0482 9912
                        </p>
                        <p className="mt-1 text-[#71717A]">
                          Meezan Bank Ltd · Title: Zayr Select Commerce
                        </p>
                      </div>
                      <div>
                        <label
                          htmlFor="raast-ref"
                          className="block text-xs text-[#A1A1AA] mb-1"
                        >
                          Transaction Reference / Sender Last 4 Digits
                        </label>
                        <input
                          id="raast-ref"
                          type="text"
                          value={raastRef}
                          onChange={(e) => setRaastRef(e.target.value)}
                          placeholder="e.g. RAAST-9941"
                          className="h-10 w-full rounded-lg border border-white/[0.1] bg-[#12141A] px-3 font-mono text-sm text-[#F4F4F5] placeholder:text-[#71717A] focus:border-[#E2A84B] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === PaymentMethod.COD && (
                    <label className="flex items-start gap-2.5 text-xs text-[#D4D4D8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={codAccepted}
                        onChange={(e) => setCodAccepted(e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-[#E2A84B]"
                      />
                      <span>
                        Confirm Cash on Delivery total of{' '}
                        <strong className="font-mono text-[#F4F4F5]">
                          {formatPkr(totalPkr)}
                        </strong>
                        . Open-parcel seal verification is enabled before payment.
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-300"
                >
                  {formError}
                </div>
              )}
            </form>
          )}

          {step === 'receipt' && completedOrder && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 p-5">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#10B981]">
                  <ShieldCheck className="h-5 w-5" />
                  <span>
                    Order #{completedOrder.orderId} Confirmed — Preparing Shipment
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#D4D4D8]">
                  Confirmation sent to {completedOrder.phone}. Your items will dispatch via{' '}
                  {completedOrder.courier} to {completedOrder.city}.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#0B0C0F] p-5 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Recipient</span>
                  <span className="font-medium text-[#F4F4F5]">
                    {completedOrder.customerName}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#71717A]">Delivery Address</span>
                  <span className="text-right text-[#F4F4F5]">
                    {completedOrder.address}, {completedOrder.city}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#71717A]">Payment Method</span>
                  <span className="text-right text-[#F4F4F5]">
                    {completedOrder.paymentLabel}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/[0.08] pt-4 text-xs">
                {completedOrder.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variant}`}
                    className="flex justify-between"
                  >
                    <span className="text-[#D4D4D8]">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-mono tabular-nums text-[#F4F4F5]">
                      {formatPkr(item.unitPricePkr * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-white/[0.06] text-sm font-semibold text-[#F4F4F5]">
                  <span>Total Paid / Due</span>
                  <span className="font-mono tabular-nums text-[#E2A84B]">
                    {formatPkr(completedOrder.totalPkr)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => onTrackOrder(completedOrder.orderId)}
                  className="w-full rounded-lg bg-[#E2A84B] px-5 py-3 text-xs font-semibold text-[#090A0D] hover:bg-[#eab866] transition-colors cursor-pointer min-h-[44px]"
                >
                  Track Shipment Status
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-lg border border-white/[0.12] bg-transparent px-5 py-3 text-xs font-medium text-[#F4F4F5] hover:bg-white/[0.05] transition-colors cursor-pointer min-h-[44px]"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Totals & Action */}
        {items.length > 0 && step !== 'receipt' && (
          <div className="border-t border-white/[0.08] bg-[#0B0C0F] px-6 py-5 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#F4F4F5]">
                  {formatPkr(subtotalPkr)}
                </span>
              </div>
              {discountPkr > 0 && (
                <div className="flex justify-between text-[#10B981]">
                  <span>Promo Savings ({activeOffer?.code})</span>
                  <span className="font-mono tabular-nums">-{formatPkr(discountPkr)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Courier Delivery</span>
                <span className="font-mono tabular-nums text-[#F4F4F5]">
                  {deliveryFeePkr === 0 ? 'Free' : formatPkr(deliveryFeePkr)}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/[0.08] pt-2 text-sm font-semibold text-[#F4F4F5]">
                <span>Total</span>
                <span className="font-mono tabular-nums text-[#E2A84B]">
                  {formatPkr(totalPkr)}
                </span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full rounded-lg bg-[#E2A84B] px-5 py-3 text-sm font-semibold text-[#090A0D] hover:bg-[#eab866] transition-colors duration-150 cursor-pointer min-h-[44px]"
              >
                Proceed to Secure Checkout
              </button>
            ) : (
              <button
                type="submit"
                form="secure-checkout-form"
                disabled={isProcessing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#E2A84B] px-5 py-3 text-sm font-semibold text-[#090A0D] hover:bg-[#eab866] disabled:opacity-60 transition-colors duration-150 cursor-pointer min-h-[44px]"
              >
                <Lock className="h-4 w-4" />
                <span>
                  {isProcessing
                    ? 'Verifying & Encrypting Order...'
                    : `Confirm Order · ${formatPkr(totalPkr)}`}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
