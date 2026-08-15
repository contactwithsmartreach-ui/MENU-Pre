export type MenuCategory = "all" | "starters" | "mains" | "desserts" | "drinks";

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory | string;
  price: number;
  rating: number;
  description: string;
  image: string;
  prepTime?: string;
  isSignature?: boolean;
  calories?: number;
  spiceLevel?: number;
  ingredients?: string[];
  reviewsCount?: number;
  tags?: string[];
}

export interface CartItem {
  dish: MenuItem;
  quantity: number;
  notes?: string;
}