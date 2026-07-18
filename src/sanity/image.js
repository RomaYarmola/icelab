import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

// Повертає URL зображення Sanity (або null, якщо CMS не налаштована/немає asset).
export function urlForImage(source, { width, height } = {}) {
  if (!builder || !source?.asset) return null;
  try {
    let img = builder.image(source).auto("format").fit("max");
    if (width) img = img.width(width);
    if (height) img = img.height(height);
    return img.url();
  } catch {
    return null;
  }
}

// Квадратний кроп для OpenGraph/Twitter (компактна картка summary → маленьке
// прев'ю праворуч у Telegram/соцмережах, а не величезний банер). За замовчуванням
// 600×600 із фокусом за hotspot.
export function urlForImageSquare(source, size = 600) {
  if (!builder || !source?.asset) return null;
  try {
    return builder
      .image(source)
      .width(size)
      .height(size)
      .fit("crop")
      .auto("format")
      .url();
  } catch {
    return null;
  }
}
