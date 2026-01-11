import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BreadcrumbItem } from "@/types";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 p-4 border-b bg-white overflow-x-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate("/")}
        className="shrink-0"
      >
        <Home className="h-4 w-4" />
      </Button>

      {items.map((item, index) => (
        <div key={item.path} className="flex items-center gap-1 shrink-0">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item.path)}
            className={index === items.length - 1 ? "font-mac-medium" : ""}
          >
            {item.label}
          </Button>
        </div>
      ))}
    </nav>
  );
}

