import { validateField } from "@/helpers/validation";
import { Input, Switch } from "@nextui-org/react";

export default function FormBlock({
  handleSubmit,
  formData,
  formErrors,
  setFormData,
  setFormErrors,
  touchedFields,
  setTouchedFields,
  isPickup,
  handlePickupChange,
}) {
  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setFormErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const { name, phone, email, city, address } = formData;

  return (
    <div className="md:w-[48%]">
      <h3 className="mb-8 text-xl-heading font-medium main-title-gradient text-center ">
        Доставка
      </h3>
      <div className="mb-4 flex justify-end xs:w-[90%]  sm:max-w-[448px] sm:w-full mx-auto">
        <Switch
          isSelected={isPickup}
          onChange={handlePickupChange}
          color="default"
        >
          Самовивіз
        </Switch>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-5 w-full mx-auto xs:w-[90%]  sm:max-w-[448px] sm:w-full font-montserrat not-italic"
      >
        <div className="relative">
          <Input
            isRequired
            className={`block w-full mb-1 rounded-md custom-input overflow-hidden required-field`}
            placeholder="Імʼя"
            name="name"
            value={name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
          />
          {formErrors.name && touchedFields.name && (
            <p className="text-[#F31260] text-[10px] absolute top-[100%]">
              {formErrors.name}
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            isRequired
            className={`block w-full mb-1 rounded-md custom-input overflow-hidden required-field`}
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

        <Input
          className={`block w-full mb-1 rounded-md custom-input overflow-hidden`}
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
        />

        {!isPickup && (
          <>
            <div className="relative">
              <Input
                isRequired
                className={`block w-full mb-1 rounded-md custom-input overflow-hidden required-field
            `}
                placeholder="Місто"
                name="city"
                value={city}
                onChange={handleChange}
                onBlur={() => handleBlur("city")}
              />
              {formErrors.city && touchedFields.city && (
                <p className="text-[#F31260] text-[10px] absolute top-[100%]">
                  {formErrors.city}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                isRequired
                className={`block w-full mb-1 rounded-md custom-input overflow-hidden required-field
            `}
                placeholder="Відділення Нової пошти"
                name="address"
                value={address}
                onChange={handleChange}
                onBlur={() => handleBlur("address")}
              />
              {formErrors.address && touchedFields.address && (
                <p className="text-[#F31260] text-[10px] absolute top-[100%]">
                  {formErrors.address}
                </p>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
}
