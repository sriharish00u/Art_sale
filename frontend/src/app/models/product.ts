export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  whatsappLink: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: { id: string; email: string; role: string };
}

export interface AdminDashboardData {
  authenticated: boolean;
  admin: { id: string; email: string; role: string };
  productCount: number;
  categories: string[];
  recentProducts: Product[];
}
