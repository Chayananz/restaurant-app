import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/context/cart-store";
import { formatPrice } from "@/lib/utils";

export function Cart() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <ShoppingBag className="h-24 w-24 text-[var(--muted-foreground)]" />
        <h2 className="mt-4 text-2xl font-semibold">ตะกร้าว่างเปล่า</h2>
        <p className="mt-2 text-[var(--muted-foreground)]">
          เลือกเมนูที่คุณชอบแล้วเพิ่มลงตะกร้า
        </p>
        <Link to="/">
          <Button className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปดูเมนู
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">ตะกร้าสินค้า</h1>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            <Trash2 className="mr-2 h-4 w-4" />
            ล้างตะกร้า
          </Button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.menuItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <img
                      src={item.menuItem.image || "/placeholder-food.jpg"}
                      alt={item.menuItem.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.menuItem.name}</h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {formatPrice(item.menuItem.price)} / ชิ้น
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.menuItem.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.menuItem.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[var(--primary)]">
                        {formatPrice(item.menuItem.price * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[var(--destructive)]"
                        onClick={() => removeItem(item.menuItem.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold">สรุปคำสั่งซื้อ</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.menuItem.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-[var(--muted-foreground)]">
                    {item.menuItem.name} x {item.quantity}
                  </span>
                  <span>
                    {formatPrice(item.menuItem.price * item.quantity)}
                  </span>
                </div>
              ))}
              <hr className="border-[var(--border)]" />
              <div className="flex justify-between font-semibold">
                <span>รวมทั้งหมด</span>
                <span className="text-xl text-[var(--primary)]">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="mt-6 w-full" size="lg">
                ดำเนินการสั่งซื้อ
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="mt-2 w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                เลือกเมนูเพิ่ม
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
