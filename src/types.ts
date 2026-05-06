
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'seller';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  sellerId?: string;
  isOffer?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
