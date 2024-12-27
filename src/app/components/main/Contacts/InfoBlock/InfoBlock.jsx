import Container from "@/utils/Container";
import Form from "./Form";
import ContactsBlock from "./ContactsBlock";

export default function InfoBlock() {
  return (
    <div className="relative overflow-x-clip bg-white ">
      <div className="absolute radial-white-gradient w-[2447px] max-h-[375px] top-[-29px] left-1/2 transform -translate-x-1/2 z-[1]" />
      <Container>
        <div className="pt-[27px] md:pt-32 flex flex-col md:flex-row gap-20 md:gap-4 md:justify-between pb-[122px] l:pb-[148px] relative z-10">
          <Form />
          <ContactsBlock />
        </div>
      </Container>
    </div>
  );
}
