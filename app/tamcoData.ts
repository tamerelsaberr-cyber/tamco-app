export interface ProductItem {
  id: string | number;
  name: string;
  price: string;
  image?: string[];
  category?: string;
}

export interface OrderTrackingItem {
  id: string;
  title: string;
  woodType: string;
  dimensions: string;
  finishing: string;
  paymentPlan: string;
  currentStage: number;
  trackingNumber: string;
}

export const DEFAULT_PRODUCTS: ProductItem[] = [
  { id: 1, name: "Modern Complete Bedroom Suite", price: "45.00 Pi", category: "Bedroom" },
  { id: 2, name: "Classic Beech Wood Salon Set", price: "30.00 Pi", category: "Living Room" },
  { id: 3, name: "Dining Table with 6 Chairs", price: "22.00 Pi", category: "Dining" },
];

export const TRACKING_STAGES: string[] = [
  "1. Contract & Specs Approved",
  "2. Carpentry & Frame Assembly",
  "3. Painting & Surface Finishing",
  "4. Protective Packaging",
  "5. In Transit & Shipping",
  "6. Delivered & Installed",
];

export const INITIAL_ORDERS: OrderTrackingItem[] = [
  {
    id: "TMC-101",
    title: "Modern American Sofa Set",
    woodType: "Solid Beech Wood",
    dimensions: "240cm x 95cm x 85cm",
    finishing: "Matte Walnut & Linen",
    paymentPlan: "50% Split Payment (Stage 1 Paid)",
    currentStage: 2,
    trackingNumber: "TRK-884920-PI",
  },
  {
    id: "TMC-102",
    title: "Sliding Door Wardrobe",
    woodType: "Oak Veneer & MDF",
    dimensions: "260cm x 220cm x 65cm",
    finishing: "Natural Satin Oak",
    paymentPlan: "Full Payment Completed",
    currentStage: 4,
    trackingNumber: "TRK-884955-PI",
  },
];