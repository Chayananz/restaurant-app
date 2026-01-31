import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/context/cart-store";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image || "/placeholder-food.jpg"}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!item.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="destructive" className="text-sm">
                หมด
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[var(--foreground)] line-clamp-1">
              {item.name}
            </h3>
            <span className="whitespace-nowrap font-bold text-[var(--primary)]">
              {formatPrice(item.price)}
            </span>
          </div>
          {item.description && (
            <p className="mb-4 text-sm text-[var(--muted-foreground)] line-clamp-2">
              {item.description}
            </p>
          )}

          {item.available && (
            <div className="flex items-center justify-center gap-2">
              {quantity > 0 ? (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => addItem(item)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => addItem(item)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  เพิ่มลงตะกร้า
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
