import { useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  Plus,
  Edit,
  Trash2,
  ChefHat,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { menuItems, categories } from "@/lib/mock-data";
import type { MenuItem, Order, OrderStatus } from "@/types";

// Demo data
const demoStats = {
  todaySales: 12580,
  todayOrders: 47,
  activeOrders: 8,
  totalMenuItems: menuItems.length,
};

const pendingOrders: Order[] = [
  {
    id: "101",
    userId: "1",
    total: 195,
    status: "PENDING",
    tableNo: 5,
    createdAt: new Date().toISOString(),
    items: [],
  },
  {
    id: "102",
    userId: "2",
    total: 320,
    status: "PREPARING",
    tableNo: 3,
    createdAt: new Date(Date.now() - 600000).toISOString(),
    items: [],
  },
  {
    id: "103",
    userId: "3",
    total: 145,
    status: "READY",
    tableNo: 7,
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    items: [],
  },
];

type Tab = "dashboard" | "menu" | "orders";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [menuList, setMenuList] = useState<MenuItem[]>(menuItems);
  const [orders, setOrders] = useState<Order[]>(pendingOrders);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const deleteMenuItem = (id: string) => {
    if (confirm("ต้องการลบเมนูนี้หรือไม่?")) {
      setMenuList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const tabs = [
    { id: "dashboard" as Tab, label: "ภาพรวม", icon: TrendingUp },
    { id: "menu" as Tab, label: "จัดการเมนู", icon: UtensilsCrossed },
    { id: "orders" as Tab, label: "จัดการออเดอร์", icon: ShoppingBag },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      ยอดขายวันนี้
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[var(--primary)]">
                      {formatPrice(demoStats.todaySales)}
                    </p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      ออเดอร์วันนี้
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {demoStats.todayOrders}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      ออเดอร์ที่กำลังทำ
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {demoStats.activeOrders}
                    </p>
                  </div>
                  <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                    <ChefHat className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      จำนวนเมนู
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {demoStats.totalMenuItems}
                    </p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                    <UtensilsCrossed className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>ออเดอร์ล่าสุด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--border)] p-4"
                  >
                    <div>
                      <p className="font-medium">ออเดอร์ #{order.id}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        โต๊ะ {order.tableNo}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(order.total)}</p>
                      <Badge
                        variant={
                          order.status === "PENDING"
                            ? "warning"
                            : order.status === "PREPARING"
                            ? "secondary"
                            : "success"
                        }
                      >
                        {order.status === "PENDING"
                          ? "รอดำเนินการ"
                          : order.status === "PREPARING"
                          ? "กำลังทำ"
                          : "พร้อมเสิร์ฟ"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Menu Management Tab */}
      {activeTab === "menu" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex justify-end">
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มเมนูใหม่
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-[var(--border)]">
            <table className="w-full">
              <thead className="bg-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    เมนู
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    หมวดหมู่
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    ราคา
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    สถานะ
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {menuList.map((item) => {
                  const category = categories.find(
                    (c) => c.id === item.categoryId
                  );
                  return (
                    <tr
                      key={item.id}
                      className="border-t border-[var(--border)]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {category?.icon} {category?.name}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={item.available ? "success" : "destructive"}>
                          {item.available ? "มีพร้อมขาย" : "หมด"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[var(--destructive)]"
                            onClick={() => deleteMenuItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Orders Management Tab */}
      {activeTab === "orders" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">ออเดอร์ #{order.id}</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      โต๊ะ {order.tableNo} •{" "}
                      {new Date(order.createdAt).toLocaleTimeString("th-TH")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--primary)]">
                      {formatPrice(order.total)}
                    </span>
                    <Badge
                      variant={
                        order.status === "PENDING"
                          ? "warning"
                          : order.status === "PREPARING"
                          ? "secondary"
                          : order.status === "READY"
                          ? "success"
                          : "default"
                      }
                    >
                      {order.status === "PENDING"
                        ? "รอดำเนินการ"
                        : order.status === "PREPARING"
                        ? "กำลังทำ"
                        : order.status === "READY"
                        ? "พร้อมเสิร์ฟ"
                        : "เสร็จสิ้น"}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {order.status === "PENDING" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "PREPARING")}
                    >
                      <ChefHat className="mr-2 h-4 w-4" />
                      เริ่มทำอาหาร
                    </Button>
                  )}
                  {order.status === "PREPARING" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "READY")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      พร้อมเสิร์ฟ
                    </Button>
                  )}
                  {order.status === "READY" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "COMPLETED")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      เสร็จสิ้น
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
}
