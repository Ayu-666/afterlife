import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  const imgSize = size === "sm" ? 24 : size === "lg" ? 40 : 32;
  const textSize =
    size === "sm"
      ? "text-[15px]"
      : size === "lg"
      ? "text-[22px]"
      : "text-[18px]";

  return (
    <Link href="/" className={`flex items-center gap-2 shrink-0 group ${className}`}>
      <Image
        src="/images/brand/afterlife-logo.png"
        alt="AFTERLIFE Brand Logo"
        width={imgSize}
        height={imgSize}
        className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        priority
      />
      <span
        className={`font-[family-name:var(--font-playfair)] ${textSize} font-semibold tracking-tight text-primary uppercase leading-none`}
      >
        AFTERLIFE
      </span>
    </Link>
  );
}
