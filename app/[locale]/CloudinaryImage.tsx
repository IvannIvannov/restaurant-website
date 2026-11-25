"use client";

import Image, { type ImageProps, type ImageLoaderProps } from "next/image";

type CloudinaryImageProps = Omit<
  ImageProps,
  "loader" | "src" | "unoptimized" | "alt"
> & {
  src: string;
  alt: string;
};

function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const match = src.match(
    /^(https:\/\/res\.cloudinary\.com\/(?:dznyfk4z6|mxjelcos)\/image\/upload\/)(?:.*?\/)?(v\d+\/.+)$/,
  );

  if (!match) {
    throw new Error(`Invalid Cloudinary image URL: ${src}`);
  }

  const [, baseUrl, assetPath] = match;

  const safeWidth = Math.max(1, Math.round(width));

  const safeQuality = Math.min(100, Math.max(1, quality ?? 70));

  const transformations = [
    `c_limit,w_${safeWidth}`,
    `q_${safeQuality}`,
    "f_auto",
  ].join("/");

  return `${baseUrl}${transformations}/${assetPath}`;
}

export default function CloudinaryImage({
  src,
  alt,
  ...props
}: CloudinaryImageProps) {
  return <Image {...props} src={src} alt={alt} loader={cloudinaryLoader} />;
}
