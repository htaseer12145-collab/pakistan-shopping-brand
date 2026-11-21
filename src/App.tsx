import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { AffiliateSettingsModal } from './components/AffiliateSettingsModal';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { CatalogSection } from './components/CatalogSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { OffersAndFulfillment } from './components/OffersAndFulfillment';
import { ProductDetailModal } from './components/ProductDetailModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { DEFAULT_AFFILIATE_CONFIG, PRODUCTS, SEED_ORDER } from './data/products';
import {
  AffiliateClickEvent,
  AffiliateConfig,
  AffiliatePartner,
  CartItem,
  OrderRecord,
  Product,
  ProductCategory,
  SortOption,
} from './types';

const CART_STORAGE_KEY = 'zayr_select_cart_v1';
const ORDERS_STORAGE_KEY = 'zayr_select_orders_v1';
const AFFILIATE_CONFIG_KEY = 'zayr_select_affiliate_config_v1';
const AFFILIATE_CLICKS_KEY = 'zayr_select_affiliate_clicks_v1';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(
    ProductCategory.ALL
  );
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyDiscounts, setOnlyDiscounts] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.FEATURED);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as OrderRecord[];
        return parsed.length > 0 ? parsed : [SEED_ORDER];
      }
      return [SEED_ORDER];
    } catch {
      return [SEED_ORDER];
    }
  });

  const [affiliateConfig, setAffiliateConfig] = useState<AffiliateConfig>(() => {
    try {
      const raw = localStorage.getItem(AFFILIATE_CONFIG_KEY);
      return raw ? (JSON.parse(raw) as AffiliateConfig) : DEFAULT_AFFILIATE_CONFIG;
    } catch {
      return DEFAULT_AFFILIATE_CONFIG;
    }
  });

  const [affiliateClickLog, setAffiliateClickLog] = useState<AffiliateClickEvent[]>(() => {
    try {
      const raw = localStorage.getItem(AFFILIATE_CLICKS_KEY);
      return raw ? (JSON.parse(raw) as AffiliateClickEvent[]) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isTrackOpen, setIsTrackOpen] = useState<boolean>(false);
  const [isAffiliateOpen, setIsAffiliateOpen] = useState<boolean>(false);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(AFFILIATE_CONFIG_KEY, JSON.stringify(affiliateConfig));
    } catch {
      // Ignore storage quota errors
    }
  }, [affiliateConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(AFFILIATE_CLICKS_KEY, JSON.stringify(affiliateClickLog));
    } catch {
      // Ignore storage quota errors
    }
  }, [affiliateClickLog]);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2600);
  };

  const handleTrackAffiliateClick = (product: Product, partner: AffiliatePartner) => {
    const entry: AffiliateClickEvent = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      partner,
      pricePkr: product.pricePkr,
      commissionRate: product.commissionRate,
      clickedAt: new Date().toISOString(),
    };
    setAffiliateClickLog((prev) => [entry, ...prev.slice(0, 49)]);
    showToast(
      `Opening ${partner === 'daraz' ? 'Daraz.pk' : 'Amazon'} with your commission tracking link`
    );
  };

  const handleAddToCart = (product: Product, variant: string, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variant === variant
      );
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: Math.min(10, next[existingIndex].quantity + quantity),
        };
        return next;
      }
      return [...prev, { product, variant, quantity }];
    });

    setRecentlyAddedId(product.id);
    window.setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === product.id ? null : prev));
    }, 1200);

    showToast(`Added ${product.name} to your bag`);
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, product.variants[0] || 'Standard', 1);
  };

  const handleUpdateQuantity = (productId: string, variant: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.variant === variant) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string, variant: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.variant === variant)
      )
    );
  };

  const handleOrderComplete = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setAppliedPromoCode(null);
  };

  const handleApplyPromoFromBanner = (code: string) => {
    setAppliedPromoCode(code);
    showToast(`Promo code ${code} activated for your bag`);
    if (cartItems.length > 0) {
      setIsCartOpen(true);
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#090A0D] text-[#F4F4F5] relative">
      {/* Subtle Ambient Cinematic Radial Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(226,168,75,0.06)_0%,_rgba(9,10,13,0)_55%)]"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenTrackOrder={() => setIsTrackOpen(true)}
          onNavigateCategory={(category) => {
            setSelectedCategory(category);
            setSelectedBrand('All Brands');
          }}
        />

        <main className="flex-1">
          <HeroSection
            onExploreCategory={(category) => {
              setSelectedCategory(category);
              setSelectedBrand('All Brands');
            }}
            onJumpToOffers={() => {
              const el = document.getElementById('offers');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            onOpenTrackOrder={() => setIsTrackOpen(true)}
          />

          <CatalogSection
            products={PRODUCTS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onlyDiscounts={onlyDiscounts}
            onToggleDiscounts={() => setOnlyDiscounts((v) => !v)}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onSelectProduct={(product) => setActiveProduct(product)}
            onQuickAdd={handleQuickAdd}
            recentlyAddedId={recentlyAddedId}
            affiliateConfig={affiliateConfig}
            onTrackAffiliateClick={handleTrackAffiliateClick}
          />

          <OffersAndFulfillment
            appliedPromoCode={appliedPromoCode}
            onApplyPromoCode={handleApplyPromoFromBanner}
            onOpenAffiliateSettings={() => setIsAffiliateOpen(true)}
          />
        </main>

        <Footer
          onNavigateCategory={(category) => setSelectedCategory(category)}
          onOpenTrackOrder={() => setIsTrackOpen(true)}
          onOpenAffiliateSettings={() => setIsAffiliateOpen(true)}
        />
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
        affiliateConfig={affiliateConfig}
        onTrackAffiliateClick={handleTrackAffiliateClick}
      />

      {/* Slide-Over Cart & Secure Checkout Drawer */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        appliedPromoCode={appliedPromoCode}
        onApplyPromoCode={setAppliedPromoCode}
        onOrderComplete={handleOrderComplete}
        onTrackOrder={(orderId) => {
          setTrackedOrderId(orderId);
          setIsCartOpen(false);
          setIsTrackOpen(true);
        }}
      />

      {/* Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOpen}
        onClose={() => {
          setIsTrackOpen(false);
          setTrackedOrderId(null);
        }}
        orders={orders}
        initialOrderId={trackedOrderId}
      />

      {/* Partner Affiliate Config & Click Log Modal */}
      <AffiliateSettingsModal
        isOpen={isAffiliateOpen}
        onClose={() => setIsAffiliateOpen(false)}
        config={affiliateConfig}
        onSaveConfig={(next) => {
          setAffiliateConfig(next);
          showToast('Daraz & Amazon affiliate IDs updated across all products');
        }}
        clickLog={affiliateClickLog}
        onClearClickLog={() => setAffiliateClickLog([])}
      />

      {/* Subtle Non-Intrusive Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border border-white/[0.14] bg-[#12141A] px-4 py-3 text-xs font-medium text-[#F4F4F5] shadow-xl"
        >
          <Check className="h-4 w-4 text-[#E2A84B]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
