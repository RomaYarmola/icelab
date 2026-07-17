import CatalogCard from "./CatalogCard";

// Сітка товарів каталогу. Отримує вже нормалізовані/локалізовані товари
// зі сторінки (data-access layer), сама даних не тягне.
export default function CatalogList({ products }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 l:grid-cols-3 gap-5 l:gap-8">
      {products.map((product) => (
        <CatalogCard key={product.id} product={product} />
      ))}
    </ul>
  );
}
