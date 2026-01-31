export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  category?: Category;
  available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  tableNo: number | null;
  createdAt: string;
  user?: User;
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  price: number;
  item?: MenuItem;
}

export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}
