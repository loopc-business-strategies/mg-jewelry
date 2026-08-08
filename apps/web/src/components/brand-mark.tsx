"use client";

// Brand mark asset: /brand/logo-mark.png

import Image from "next/image";

const DEFAULT_LOGO = "/brand/logo-mark.png";

type BrandMarkProps = {
  size?: "header" | "footer";
  spin?: boolean;
  src?: string;
  className?: string;
};

const sizeMap = {
  header: {
    width: 72,
    height: 57,
    className: "h-12 w-auto max-w-[3.5rem] sm:max-w-none md:h-16",
    boxClass: "h-12 w-14 shrink-0 sm:h-14 sm:w-[4.5rem] md:h-16 md:w-20",
  },
  footer: {
    width: 88,
    height: 70,
    className: "h-14 w-auto max-w-[4.5rem] md:h-[4.5rem] md:max-w-none",
    boxClass: "h-14 w-[4.5rem] md:h-[4.5rem] md:w-24",
  },
} as const;

function LogoImage({
  src,
  width,
  height,
  className,
  priority,
}: {
  src: string;
  width: number;
  height: number;
  className: string;
  priority?: boolean;
}) {
  const isRemote = /^https?:\/\//i.test(src);
  const imgClass = `${className} bg-transparent object-contain`;

  if (isRemote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="Modern Gold Jewelry"
        width={width}
        height={height}
        className={imgClass}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={src}
      alt="Modern Gold Jewelry"
      width={width}
      height={height}
      className={imgClass}
      quality={100}
      unoptimized
      priority={priority}
    />
  );
}

export function BrandMark({
  size = "header",
  spin = false,
  src,
  className = "",
}: BrandMarkProps) {
  const dims = sizeMap[size];
  const logoSrc = src?.trim() || DEFAULT_LOGO;

  if (!spin) {
    return (
      <span
        className={`brand-mark brand-mark-glow-static relative inline-flex items-center justify-center bg-transparent ${className}`}
      >
        <LogoImage
          src={logoSrc}
          width={dims.width}
          height={dims.height}
          className={dims.className}
        />
      </span>
    );
  }

  return (
    <span
      className={`brand-mark brand-mark-glow relative inline-flex shrink-0 items-center justify-center overflow-visible bg-transparent ${dims.boxClass} ${className}`}
      aria-label="Modern Gold Jewelry"
    >
      <span className="brand-mark-inner">
        <span className="brand-mark-face brand-mark-face-front">
          <LogoImage
            src={logoSrc}
            width={dims.width}
            height={dims.height}
            className={dims.className}
            priority
          />
        </span>
        <span className="brand-mark-face brand-mark-face-back">
          <LogoImage
            src={logoSrc}
            width={dims.width}
            height={dims.height}
            className={dims.className}
          />
        </span>
      </span>
    </span>
  );
}
