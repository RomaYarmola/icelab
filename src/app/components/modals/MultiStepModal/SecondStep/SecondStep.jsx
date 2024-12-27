import { Input, ModalBody, ModalContent } from "@nextui-org/react";
import GradientButton from "../../../common/GradientButton";
import SecondStepHeader from "./SecondStepHeader";

export default function SecondStep({
  name,
  phone,
  comment,
  onFormDataChange,
  onSubmit,
  formErrors,
  onBlur,
  touchedFields,
  handleClose,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    onFormDataChange(name, value);
  };

  return (
    <ModalContent>
      <SecondStepHeader handleClose={handleClose} />
      <ModalBody className="font-montserrat not-italic text-xs-responsive">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Submitting form...");
            onSubmit();
          }}
          className="flex flex-col gap-[18px] w-[288px] mx-auto"
        >
          <div className="relative">
            <Input
              isRequired
              className={`block w-full mb-1 border rounded custom-input ${
                name === "" && "required-field"
              }`}
              placeholder="Імʼя"
              name="name"
              value={name}
              onChange={handleChange}
              onBlur={() => onBlur("name")}
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
              className={`block w-full mb-1 border rounded custom-input ${
                phone === "" && "required-field"
              }`}
              placeholder="Телефон"
              name="phone"
              value={phone}
              onChange={handleChange}
              onBlur={() => onBlur("phone")}
            />
            {formErrors.phone && touchedFields.phone && (
              <p className="text-[#F31260] text-[10px] absolute top-[100%]">
                {formErrors.phone}
              </p>
            )}
          </div>
          <textarea
            className="block w-full rounded-md px-5 pt-[13px] pb-4 resize-none h-[158px] outline-none"
            placeholder="Ваше повідомлення"
            name="comment"
            value={comment}
            onChange={(e) => onFormDataChange("comment", e.target.value)}
          />
          <GradientButton variant="small" type="submit" text="Відправити" />
        </form>
      </ModalBody>
    </ModalContent>
  );
}
