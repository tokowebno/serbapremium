"use client";

import { ShoppingCart } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useCart } from "./providers";

export function AddToCartButton({
  slug,
  size = "md",
  className,
}: {
  slug: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { add } = useCart();
  const { push } = useToast();
  const app = api.apps.getBySlug(slug);
  if (!app) return null;

  return (
    <Button
      variant="secondary"
      size={size}
      className={className}
      onClick={() => {
        const platform = app.platforms[0];
        add(app, platform);
        push({
          title: "Ditambahkan ke keranjang",
          description: `${app.name} untuk ${platform}`,
        });
      }}
    >
      <ShoppingCart size={size === "sm" ? 14 : 16} />
      Tambahkan ke Keranjang
    </Button>
  );
}
