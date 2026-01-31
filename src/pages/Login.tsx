import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/context/auth-store";

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // For demo purposes, simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo users
      if (isLogin) {
        if (
          formData.email === "admin@restaurant.com" &&
          formData.password === "admin123"
        ) {
          setUser(
            {
              id: "1",
              email: "admin@restaurant.com",
              name: "Admin",
              role: "ADMIN",
            },
            "demo-token"
          );
          navigate("/admin");
        } else if (
          formData.email === "user@restaurant.com" &&
          formData.password === "user123"
        ) {
          setUser(
            {
              id: "2",
              email: "user@restaurant.com",
              name: "ลูกค้า",
              role: "CUSTOMER",
            },
            "demo-token"
          );
          navigate("/");
        } else {
          throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }
      } else {
        // Register new user
        setUser(
          {
            id: "3",
            email: formData.email,
            name: formData.name,
            role: "CUSTOMER",
          },
          "demo-token"
        );
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardContent className="p-8">
            {/* Logo */}
            <div className="mb-6 flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
                <UtensilsCrossed className="h-8 w-8" />
              </div>
              <h1 className="mt-4 text-2xl font-bold">
                {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
              </h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {isLogin
                  ? "เข้าสู่ระบบเพื่อสั่งอาหาร"
                  : "สร้างบัญชีใหม่เพื่อเริ่มสั่งอาหาร"}
              </p>
            </div>

            {/* Demo Account Info */}
            <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-950">
              <p className="font-medium text-blue-800 dark:text-blue-200">
                บัญชีทดสอบ:
              </p>
              <p className="text-blue-600 dark:text-blue-300">
                Admin: admin@restaurant.com / admin123
              </p>
              <p className="text-blue-600 dark:text-blue-300">
                User: user@restaurant.com / user123
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm font-medium">ชื่อ</label>
                  <Input
                    type="text"
                    placeholder="กรอกชื่อของคุณ"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium">อีเมล</label>
                <Input
                  type="email"
                  placeholder="กรอกอีเมล"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="กรอกรหัสผ่าน"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    กำลังดำเนินการ...
                  </span>
                ) : isLogin ? (
                  "เข้าสู่ระบบ"
                ) : (
                  "สมัครสมาชิก"
                )}
              </Button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center text-sm">
              <span className="text-[var(--muted-foreground)]">
                {isLogin ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"}
              </span>{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="font-medium text-[var(--primary)] hover:underline"
              >
                {isLogin ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
