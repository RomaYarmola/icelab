"use client";
import GradientButton from "@/app/components/common/GradientButton";
import { validateField } from "@/helpers/validation";
import { sendMessage } from "@/utils/sendMessage";
import { Input } from "@nextui-org/react";
import { useState } from "react";

export default function Form() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    comment: "",
  });

  const [formErrors, setFormErrors] = useState({
    phone: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    phone: false,
  });

  const [buttonText, setButtonText] = useState("Відправити");

  const handleSubmit = async () => {
    const errors = {
      phone: validateField("phone", formData.phone),
    };

    setFormErrors(errors);

    if (!errors.name && !errors.phone) {
      const message = `
        ❓ Заявка:
        - Ім'я: ${formData.name}
        - Телефон: ${formData.phone}
        - Повідомлення: ${formData.comment}
      `;
      console.log(message);
      const result = await sendMessage(message);

      if (result.success) {
        setButtonText("Дякуємо");
        setTimeout(() => setButtonText("Відправити"), 2000);
      }

      setFormData({
        name: "",
        phone: "",
        comment: "",
      });
      setFormErrors({
        phone: "",
      });
      setTouchedFields({
        phone: false,
      });
    } else {
      console.log("Помилки валідації:", errors);
    }
  };

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setFormErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleFormDataChange = (field, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };

      return updatedData;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    handleFormDataChange(name, value);
  };

  const { name, phone, comment } = formData;

  return (
    <div className="md:w-[48%]">
      <h3 className="mb-[52px] text-xl-heading font-medium main-title-gradient text-center ">
        Напишіть
        <br /> повідомлення
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-5 w-full mx-auto xs:w-[90%]  sm:max-w-[448px] sm:w-full font-montserrat not-italic"
      >
        <Input
          classNames={{
            inputWrapper:
              "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0",
          }}
          className="block w-full mb-1 rounded-md contactInput overflow-hidden"
          placeholder="Імʼя або назва компанії"
          name="name"
          value={name}
          onChange={handleChange}
        />
        <div className="relative">
          <Input
            classNames={{
              inputWrapper:
                "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0",
            }}
            isRequired
            className={`block w-full mb-1 rounded-md contactInput overflow-hidden ${
              phone === "" && "required-field"
            }`}
            placeholder="Номер телефону"
            name="phone"
            value={phone}
            onChange={handleChange}
            onBlur={() => handleBlur("phone")}
          />
          {formErrors.phone && touchedFields.phone && (
            <p className="text-[#F31260] text-[10px] absolute top-[100%]">
              {formErrors.phone}
            </p>
          )}
        </div>
        <textarea
          className="block w-full bg-transparent border border-commonBlue rounded-md px-5 py-[17px] mb-4 resize-none h-[145px] outline-none"
          placeholder="Ваше повідомлення"
          name="comment"
          value={comment}
          onChange={(e) => handleFormDataChange("comment", e.target.value)}
        />
        <GradientButton type="submit" text={buttonText} />
      </form>
    </div>
  );
}
