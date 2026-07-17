// Google-відгуки (Places API New). Викликається на сервері — ключ у браузер
// не потрапляє. Кешується (ISR) на добу.
//
// Щоб працювали РЕАЛЬНІ відгуки, потрібно (у Google Cloud Console):
//   1) увімкнути "Places API (New)";
//   2) дозволити цей API для ключа (API restrictions) і прибрати обмеження за
//      HTTP referrer (для серверних запитів);
//   3) задати env GOOGLE_PLACES_API_KEY.
// Place ID можна не шукати вручну — код сам знайде місце за назвою (SEARCH_*).
// Або задайте GOOGLE_PLACE_ID напряму, якщо він відомий.

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
// Place ID картки Icelab у Google (публічний ідентифікатор). Env може
// перевизначити. У проді достатньо задати лише GOOGLE_PLACES_API_KEY.
const PLACE_ID =
  process.env.GOOGLE_PLACE_ID || "ChIJnQltpR3lOkcR9mj4jM_XOJA";

// Резервний пошук за назвою, якщо Place ID колись зміниться.
const SEARCH_QUERY = "Icelab сухий лід dry ice";
const SEARCH_BIAS = { latitude: 49.7570845, longitude: 23.9338176 };

// Заглушки показуємо ЛИШЕ в dev (щоб бачити верстку). У проді без реальних
// відгуків секція ховається — жодних вигаданих відгуків на бойовому сайті.
const DEV = process.env.NODE_ENV !== "production";
const FALLBACK = {
  rating: 5,
  total: 4,
  mapsUri: "https://maps.google.com/?cid=10392293426580711670",
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

// Знаходить place_id за назвою (якщо не заданий GOOGLE_PLACE_ID).
async function resolvePlaceId() {
  if (PLACE_ID) return PLACE_ID;
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "places.id",
    },
    body: JSON.stringify({
      textQuery: SEARCH_QUERY,
      locationBias: { circle: { center: SEARCH_BIAS, radius: 5000 } },
    }),
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.places?.[0]?.id || null;
}

export async function getGoogleReviews(locale = "uk") {
  if (!API_KEY) return DEV ? FALLBACK : null;

  try {
    const placeId = await resolvePlaceId();
    if (!placeId) return DEV ? FALLBACK : null;

    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=${locale}`,
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
      mapsUri: data.googleMapsUri || FALLBACK.mapsUri,
      isFallback: false,
      reviews: reviews.slice(0, 8),
    };
  } catch {
    return DEV ? FALLBACK : null;
  }
}
