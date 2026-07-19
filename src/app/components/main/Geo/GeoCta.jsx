"use client";
import { useDisclosure } from "@nextui-org/react";
import RequestModal from "@/app/components/common/RequestModal";
import GradientButton from "@/app/components/common/GradientButton";

// Кнопка-заявка на гео-лендингу: відкриває модалку зворотного зв'язку
// (ім'я / телефон / повідомлення → Telegram). context — назва міста.
export default function GeoCta({ label, title, context }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <div className="w-full sm:w-[300px]">
        <GradientButton text={label} onPress={onOpen} />
      </div>
      <RequestModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={title}
        context={context}
      />
    </>
  );
}
