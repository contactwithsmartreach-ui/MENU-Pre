export interface MenuItem {
  id: string;
  name: string;
  category: "Pizzas" | "Burgers" | "Starters" | "Mains" | "Chef Specials" | "Desserts" | "Cocktails";
  price: number;
  description: string;
  image: string;
  prepTime: string;
  calories: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  chefNote?: string;
  spicyLevel?: number; // 0 to 3
  isSignature?: boolean;
  isVegetarian?: boolean;
}

export interface CartItem {
  dish: MenuItem;
  quantity: number;
  specialInstructions?: string;
}