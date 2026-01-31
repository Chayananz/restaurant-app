import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/context/cart-store";
import { useAuthStore } from "@/context/auth-store";
import { formatPrice, cn } from "@/lib/utils";

type PaymentMethod = "cash" | "card" | "promptpay";

export function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [tableNo, setTableNo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tableNo) {
      alert("กรุณาระบุหมายเลขโต๊ะ");
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsSuccess(true);

    // Clear cart after 2 seconds and redirect
    setTimeout(() => {
      clearCart();
      navigate("/orders");
    }, 2000);
  };

  if (items.length === 0 && !isSuccess) {
    navigate("/cart");
    return null;
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[60vh] flex-col items-center justify-center text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <CheckCircle className="h-24 w-24 text-green-500" />
        </motion.div>
        <h2 className="mt-4 text-2xl font-bold">สั่งอาหารสำเร็จ!</h2>
        <p className="mt-2 text-[var(--muted-foreground)]">
          กำลังเตรียมอาหารให้คุณ กรุณารอสักครู่...
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">ชำระเงิน</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Table Number */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">ข้อมูลโต๊ะ</h2>
            <div>
              <label className="mb-2 block text-sm font-medium">
                หมายเลขโต๊ะ *
              </label>
              <Input
                type="number"
                placeholder="กรอกหมายเลขโต๊ะ"
                value={tableNo}
                onChange={(e) => setTableNo(e.target.value)}
                min="1"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        {isAuthenticated && user && (
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">ข้อมูลลูกค้า</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-[var(--muted-foreground)]">ชื่อ: </span>
                  {user.name}
                </p>
                <p>
                  <span className="text-[var(--muted-foreground)]">
                    อีเมล:{" "}
                  </span>
                  {user.email}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Method */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">วิธีการชำระเงิน</h2>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                  paymentMethod === "cash"
                    ? "border-[var(--primary)] bg-orange-50"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                )}
              >
                <Wallet className="h-8 w-8" />
                <span className="text-sm font-medium">เงินสด</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                  paymentMethod === "card"
                    ? "border-[var(--primary)] bg-orange-50"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                )}
              >
                <CreditCard className="h-8 w-8" />
                <span className="text-sm font-medium">บัตรเครดิต</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("promptpay")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                  paymentMethod === "promptpay"
                    ? "border-[var(--primary)] bg-orange-50"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                )}
              >
                <span className="text-2xl">📱</span>
                <span className="text-sm font-medium">PromptPay</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">สรุปคำสั่งซื้อ</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.menuItem.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.menuItem.name} x {item.quantity}
                  </span>
                  <span>
                    {formatPrice(item.menuItem.price * item.quantity)}
                  </span>
                </div>
              ))}
              <hr className="border-[var(--border)]" />
              <div className="flex justify-between text-lg font-bold">
                <span>รวมทั้งหมด</span>
                <span className="text-[var(--primary)]">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              กำลังดำเนินการ...
            </span>
          ) : (
            `ยืนยันการสั่งซื้อ (${formatPrice(getTotal())})`
          )}
        </Button>
      </form>
    </div>
  );
}
