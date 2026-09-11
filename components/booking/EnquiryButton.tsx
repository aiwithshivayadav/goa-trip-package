"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { EnquiryForm } from "./EnquiryForm";
import { cn } from "@/lib/utils";

interface EnquiryButtonProps {
  productName: string;
  productSlug?: string;
  productType?: string;
  productPrice?: number;
  variant?: "default" | "outline" | "compact" | "gold";
  label?: string;
  className?: string;
}

export function EnquiryButton({
  productName,
  productSlug,
  productType,
  productPrice,
  variant = "default",
  label,
  className,
}: EnquiryButtonProps) {
  const [open, setOpen] = useState(false);

  const buttonText = label || "Enquire Now";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "transition-all",
          variant === "default" &&
            "flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border-warm text-sm font-medium text-lagoon hover:bg-lagoon-50",
          variant === "outline" &&
            "flex h-11 items-center justify-center gap-2 rounded-xl border border-border-warm px-5 text-sm font-medium text-lagoon hover:bg-lagoon-50",
          variant === "compact" &&
            "flex h-11 w-11 items-center justify-center rounded-xl border border-border-warm text-lagoon hover:bg-lagoon-50",
          variant === "gold" &&
            "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-lagoon text-sm font-bold text-white hover:bg-lagoon-600 hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        aria-label={buttonText}
      >
        {variant === "compact" ? (
          <MessageCircle className="h-4 w-4" />
        ) : (
          <>
            <MessageCircle className="h-4 w-4" />
            {buttonText}
          </>
        )}
      </button>

      <EnquiryForm
        isOpen={open}
        onClose={() => setOpen(false)}
        productName={productName}
        productSlug={productSlug}
        productType={productType}
        productPrice={productPrice}
      />
    </>
  );
}
