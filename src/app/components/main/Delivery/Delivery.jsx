"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/utils/Container";
import Order from "./Order";
import FormBlock from "./FormBlock";
import { validateField } from "@/helpers/validation";
import { sendMessage } from "@/utils/sendMessage";
import useProductStore from "@/zustand/store/productStore";
import { withLoader } from "@/helpers/withLoader";

function Delivery() {
  const router = useRouter();
  const products = useProductStore((state) => state.products);
  const clearProducts = useProductStore((state) => state.clearProducts);

  const totalValue = products.reduce((accumulator, product) => {
    return accumulator + parseFloat(product.totalPrice);
  }, 0);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState({
    phone: "",
    name: "",
    email: "",
    city: "",
    address: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    phone: false,
    name: false,
    city: false,
    address: false,
  });

  const [isPickup, setIsPickup] = useState(false);

  const handlePickupChange = () => setIsPickup(!isPickup);

  const handleSubmit = () => {
    const errors = {
      phone: validateField("phone", formData.phone),
      name: validateField("name", formData.name),
      city: !isPickup ? validateField("city", formData.city) : "",
      address: !isPickup ? validateField("address", formData.address) : "",
    };

    setFormErrors(errors);

    if (
      !errors.name &&
      !errors.phone &&
      (isPickup || (!errors.city && !errors.address))
    ) {
      let productsMessage = products
        .map((product, index) => {
          return `
        Продукт ${index + 1}:
        - Варіант льоду: ${product.iceVariant || "не вказано"}
        - Розмір: ${product.size || "не вказано"}
        - Кількість: ${product.quantity || "не вказано"} ${
            product.iceVariantEnglish === "dryIce" ? "кг" : "шт"
          }
        - Ціна за товар: ${product.totalPrice || "не розрахована"} грн
      `;
        })
        .join("\n");
      const message = `
      🧊 Замовлення:
      - Ім'я: ${formData.name}
      - Телефон: ${formData.phone}
      ${formData.email ? `- Email: ${formData.email}` : ""}
     ${
       isPickup
         ? " - Самовивіз"
         : ` - Місто: ${formData.city}\n      - Адреса: ${formData.address}`
     }
      Деталі замовлення:
      ${productsMessage}
      
      Загальна сума: ${totalValue || "не розрахована"} грн
  
    `;
      console.log(message);
      sendMessage(message);
      clearProducts();
      router.push("/thanks");

      setFormData({
        phone: "",
        name: "",
        email: "",
        city: "",
        address: "",
      });
      setFormErrors({
        phone: "",
        name: "",
        city: "",
        address: "",
      });
      setTouchedFields({
        phone: false,
        name: false,
        city: false,
        address: false,
      });
      setIsPickup(false);
    } else {
      console.log("Помилки валідації:", errors);
    }
  };

  return (
    <Container>
      <div className="mt-[100px] md:mt-[238px] mb-10 l:mb-[138px] flex flex-col md:flex-row justify-between gap-10">
        <FormBlock
          handleSubmit={handleSubmit}
          formData={formData}
          formErrors={formErrors}
          setFormData={setFormData}
          setFormErrors={setFormErrors}
          touchedFields={touchedFields}
          setTouchedFields={setTouchedFields}
          products={products}
          isPickup={isPickup}
          handlePickupChange={handlePickupChange}
        />
        <Order
          handleSubmit={handleSubmit}
          totalValue={totalValue}
          products={products}
        />
      </div>
    </Container>
  );
}

export default withLoader(Delivery);
