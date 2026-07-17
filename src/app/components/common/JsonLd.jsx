// Рендерить JSON-LD у <head>/<body> як <script type="application/ld+json">.
// data — чистий JS-об'єкт (білдери з src/lib/schema.js).
export default function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
