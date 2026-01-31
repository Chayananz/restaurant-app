import { useState } from "react";
import { Clock, CheckCircle, ChefHat, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

// Demo orders data
const demoOrders: Order[] = [
  {
    id: "1",
    userId: "1",
    total: 195,
    status: "COMPLETED",
    tableNo: 5,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    items: [
      {
        id: "1",
        orderId: "1",
        itemId: "1",
        quantity: 2,
        price: 60,
      },
      {
        id: "2",
        orderId: "1",
        itemId: "11",
        quantity: 1,
        price: 35,
      },
    ],
  },
  {
    id: "2",
    userId: "1",
    total: 289,
    status: "PREPARING",
    tableNo: 3,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    items: [
      {
        id: "3",
        orderId: "2",
        itemId: "3",
        quantity: 2,
        price: 80,
      },
      {
        id: "4",
        orderId: "2",
        itemId: "7",
        quantity: 1,
        price: 89,
      },
    ],
  },
  {
    id: "3",
    userId: "1",
    total: 159,
    status: "READY",
    tableNo: 7,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    items: [
      {
        id: "5",
        orderId: "3",
        itemId: "17",
        quantity: 1,
        price: 69,
      },
      {
        id: "6",
        orderId: "3",
        itemId: "12",
        quantity: 2,
        price: 40,
      },
    ],
  },
];

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "รอดำเนินการ",
    color: "warning",
    icon: <Clock className="h-4 w-4" />,
  },
  PREPARING: {
    label: "กำลังเตรียม",
    color: "secondary",
    icon: <ChefHat className="h-4 w-4" />,
  },
  READY: {
    label: "พร้อมเสิร์ฟ",
    color: "success",
    icon: <Package className="h-4 w-4" />,
  },
  COMPLETED: {
    label: "เสร็จสิ้น",
    color: "default",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  CANCELLED: {
    label: "ยกเลิก",
    color: "destructive",
    icon: <Clock className="h-4 w-4" />,
  },
};

export function Orders() {
  const [orders] = useState<Order[]>(demoOrders);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">ประวัติการสั่งซื้อ</h1>

      {orders.length === 0 ? (
        <div className="py-12 text-center text-[var(--muted-foreground)]">
          <Package className="mx-auto h-16 w-16" />
          <p className="mt-4 text-lg">ยังไม่มีประวัติการสั่งซื้อ</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = statusConfig[order.status];
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            คำสั่งซื้อ #{order.id}
                          </h3>
                          <Badge
                            variant={status.color as any}
                            className="flex items-center gap-1"
                          >
                            {status.icon}
                            {status.label}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                          โต๊ะ {order.tableNo} • {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[var(--primary)]">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {order.items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                          รายการ
                        </p>
                      </div>
                    </div>

                    {/* Order Progress */}
                    {order.status !== "COMPLETED" &&
                      order.status !== "CANCELLED" && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between">
                            {["PENDING", "PREPARING", "READY"].map(
                              (step, i) => {
                                const isActive =
                                  ["PENDING", "PREPARING", "READY"].indexOf(
                                    order.status
                                  ) >= i;
                                return (
                                  <div
                                    key={step}
                                    className="flex flex-1 items-center"
                                  >
                                    <div
                                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                        isActive
                                          ? "bg-[var(--primary)] text-white"
                                          : "bg-gray-200 text-gray-400"
                                      }`}
                                    >
                                      {i + 1}
                                    </div>
                                    {i < 2 && (
                                      <div
                                        className={`h-1 flex-1 ${
                                          ["PENDING", "PREPARING", "READY"].indexOf(
                                            order.status
                                          ) > i
                                            ? "bg-[var(--primary)]"
                                            : "bg-gray-200"
                                        }`}
                                      />
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-[var(--muted-foreground)]">
                            <span>รับออเดอร์</span>
                            <span>กำลังทำ</span>
                            <span>พร้อมเสิร์ฟ</span>
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
