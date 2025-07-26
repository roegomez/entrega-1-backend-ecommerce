export interface Product {
  id: string;
  title: string;
  description: string;
  code: string;
  price: number;
  status: boolean;
  stock: number;
  category: string;
  thumbnails: string[];
}

export interface CartProduct {
  product: string; // productId
  quantity: number;
}

export interface Cart {
  id: string;
  products: CartProduct[];
}