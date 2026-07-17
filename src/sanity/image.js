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
