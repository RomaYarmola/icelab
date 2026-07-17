// Google-відгуки (Places API New). Викликається на сервері — ключ у браузер
// не потрапляє. Кешується (ISR) на добу, щоб не смикати API щоразу.
//
// Щоб працювали РЕАЛЬНІ відгуки Google, потрібно:
//   1) увімкнути "Places API (New)" у Google Cloud Console;
//   2) задати env GOOGLE_PLACES_API_KEY і GOOGLE_PLACE_ID.
// Поки цього немає — повертаються тимчасові приклади (isFallback: true),
// щоб секція на головній не була порожньою.

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

// Тимчасові відгуки-заглушки (показуються, доки не підключено Google API).
const FALLBACK = {
  rating: 5,
  total: 4,
  mapsUri: "https://maps.google.com",
  isFallback: true,
  reviews: [
    {
      author: "Олександр",
      photo: null,
      rating: 5,
      text: "Замовляв сухий лід на весілля для ефекту туману — привезли вчасно, лід якісний, диму багато. Дуже задоволений сервісом!",
      relativeTime: "місяць тому",
      authorUrl: null,
    },
    {
      author: "Марина",
      photo: null,
      rating: 5,
      text: "Беремо лід регулярно для доставки продукції. Завжди в наявності навіть влітку, менеджери на звʼязку, ціни адекватні. Рекомендую.",
      relativeTime: "2 місяці тому",
      authorUrl: null,
    },
    {
      author: "Ігор",
      photo: null,
      rating: 5,
      text: "Потрібен був сухий лід для перевезення зразків. Порадили потрібний обсяг і фасування, все доїхало в холоді. Дякую за професійність!",
      relativeTime: "3 місяці тому",
      authorUrl: null,
    },
    {
      author: "Катерина",
      photo: null,
      rating: 5,
      text: "Замовляла бокс і лід для кейтерингу. Швидко, зручно, лід тримає холод довго. Будемо співпрацювати далі.",
      relativeTime: "3 місяці тому",
      authorUrl: null,
    },
  ],
};

// Заглушки показуємо ЛИШЕ в dev (щоб бачити верстку). У проді без реальних
// відгуків секція ховається — жодних вигаданих відгуків на бойовому сайті.
const DEV = process.env.NODE_ENV !== "production";

export async function getGoogleReviews(locale = "uk") {
  if (!API_KEY || !PLACE_ID) return DEV ? FALLBACK : null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=${locale}`,
      {
        headers: {
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask":
            "rating,userRatingCount,googleMapsUri,reviews.rating,reviews.text,reviews.originalText,reviews.authorAttribution,reviews.relativePublishTimeDescription",
        },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) return DEV ? FALLBACK : null;
    const data = await res.json();
    const raw = Array.isArray(data.reviews) ? data.reviews : [];

    const reviews = raw
      .map((r) => ({
        author: r.authorAttribution?.displayName || "Google",
        photo: r.authorAttribution?.photoUri || null,
        authorUrl: r.authorAttribution?.uri || null,
        rating: r.rating || 5,
        text: (r.text?.text || r.originalText?.text || "").trim(),
        relativeTime: r.relativePublishTimeDescription || "",
      }))
      .filter((r) => r.text);

    if (!reviews.length) return DEV ? FALLBACK : null;

    return {
      rating: data.rating || 5,
      total: data.userRatingCount || reviews.length,
      mapsUri: data.googleMapsUri || "https://maps.google.com",
      isFallback: false,
      reviews: reviews.slice(0, 8),
    };
  } catch {
    return DEV ? FALLBACK : null;
  }
}
