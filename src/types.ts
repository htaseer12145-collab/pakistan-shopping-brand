export enum ProductCategory {
  ALL = 'All',
  SMART_GLASSES = 'Smart Glasses',
  SMART_WATCHES = 'Smart Watches',
  FASHION = 'Fashion & Clothes',
  AUDIO = 'Audio',
  COMPUTING = 'Mobile & Computing',
  HOME_KITCHEN = 'Home & Kitchen',
  BEAUTY = 'Beauty & Fragrances',
  GAMING = 'Gaming & Tech',
  EVERYDAY_TECH = 'Everyday Tech',
}

export enum PaymentMethod {
  JAZZCASH_EASYPAISA = 'jazzcash_easypaisa',
  CARD = 'card',
  RAAST_IBFT = 'raast_ibft',
  COD = 'cod',
}

export enum SortOption {
  FEATURED = 'featured',
  PRICE_LOW = 'price_low',
  PRICE_HIGH = 'price_high',
  HIGHEST_DISCOUNT = 'highest_discount',
}

export type AffiliatePartner = 'daraz' | 'amazon';

export interface AffiliateConfig {
  darazAffiliateId: string;
  amazonAssociateTag: string;
}

export interface AffiliateClickEvent {
  id: string;
  productId: string;
  productName: string;
  partner: AffiliatePartner;
  pricePkr: number;
  commissionRate: string;
  clickedAt: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Exclude<ProductCategory, ProductCategory.ALL>;
  pricePkr: number;
  originalPricePkr: number;
  discountPercent: number;
  sourceChannel: string;
  primaryPartner: AffiliatePartner;
  darazSearchTerm: string;
  amazonSearchTerm: string;
  commissionRate: string;
  deliveryEstimate: string;
  warranty: string;
  stockStatus: string;
  description: string;
  variants: string[];
  specs: Array<{ label: string; value: string }>;
  image: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  variant: string;
  quantity: number;
}

export interface PromoOffer {
  code: string;
  title: string;
  description: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrderPkr: number;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: PaymentMethod;
  paymentLabel: string;
  courier: string;
  items: Array<{
    productId: string;
    name: string;
    brand: string;
    variant: string;
    quantity: number;
    unitPricePkr: number;
  }>;
  subtotalPkr: number;
  discountPkr: number;
  deliveryFeePkr: number;
  totalPkr: number;
  promoCode?: string;
  statusStep: number; // 0: Verified, 1: Quality & PTA Check, 2: Dispatched, 3: Out for Delivery
}
