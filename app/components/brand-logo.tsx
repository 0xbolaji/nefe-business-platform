import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  variant?: "purple" | "white";
  badge?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
};

const sizes = {
  sm: { image: "h-7 w-7", text: "text-[14px]", gap: "gap-2" },
  md: { image: "h-10 w-10", text: "text-[17px]", gap: "gap-2.5" },
  lg: { image: "h-14 w-14", text: "text-[21px]", gap: "gap-3" },
};

export default function BrandLogo({
  variant = "purple",
  badge,
  showText = true,
  size = "md",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const style = sizes[size];

  return (
    <Link
      href="/"
      aria-label="NEFE home"
      className={`inline-flex shrink-0 items-center ${style.gap} ${className}`}
    >
      <Image
        src={variant === "white" ? "/nefe-logo-white.png" : "/nefe-logo-purple.png"}
        alt=""
        width={200}
        height={200}
        priority={priority}
        className={`${style.image} shrink-0 object-contain`}
      />
      {showText && (
        <span
          className={`${style.text} font-bold leading-none tracking-[.12em] ${
            variant === "white" ? "text-white" : "text-[#211733]"
          }`}
        >
          NEFE
        </span>
      )}
      {badge && (
        <span
          className={`rounded-md px-1.5 py-1 text-[7px] font-bold uppercase tracking-[.12em] ${
            variant === "white"
              ? "bg-white/10 text-white/65"
              : "bg-[#F0ECFF] text-[#5E3BEE]"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
