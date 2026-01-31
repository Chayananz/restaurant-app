import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
          selectedCategory === null
            ? "bg-[var(--primary)] text-white shadow-md"
            : "bg-white text-[var(--foreground)] hover:bg-[var(--accent)] border border-[var(--border)]"
        )}
      >
        ทั้งหมด
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2",
            selectedCategory === category.id
              ? "bg-[var(--primary)] text-white shadow-md"
              : "bg-white text-[var(--foreground)] hover:bg-[var(--accent)] border border-[var(--border)]"
          )}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
}
