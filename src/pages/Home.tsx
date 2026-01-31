import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { MenuCard } from "@/components/menu/MenuCard";
import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { categories, menuItems } from "@/lib/mock-data";

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === null || item.categoryId === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold md:text-4xl">
            ยินดีต้อนรับสู่ร้านอาหาร
          </h1>
          <p className="mt-2 text-lg text-white/90">
            เลือกเมนูที่คุณชอบ สั่งง่าย จ่ายสะดวก
          </p>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -right-20 h-60 w-60 rounded-full bg-white/10" />
      </motion.div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <Input
          type="text"
          placeholder="ค้นหาเมนู..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Menu Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-12 text-center text-[var(--muted-foreground)]">
          <p className="text-lg">ไม่พบเมนูที่ค้นหา</p>
        </div>
      )}
    </div>
  );
}
