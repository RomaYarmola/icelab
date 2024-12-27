import SocLinks from "@/app/components/common/SocLinks";
import Link from "next/link";

export default function ContactsBlock() {
  return (
    <div className="rounded-lg bg-commonBlue py-[46px] px-[30px] flex flex-col gap-10 text-white items-center text-center md:w-[48.6%]">
      <div className="w-full">
        <h3 className="text-[20px] l:text-[32px] font-medium mb-5">Адреса</h3>
        <div className="w-full h-[150px] md:h-[250px] rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2563.680289870587!2d23.93320777620378!3d49.75718587148944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473b0c8b8e7a0c61%3A0xf5b84a1c13048c57!2zNDnCsDQ1JzI1LjkiTiAyM8KwNTYnMDMuNSJF!5e0!3m2!1sen!2sua!4v1699969402823!5m2!1sen!2sua"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <p className="font-montserrat text-md-responsive font-normal mt-5">
          Львівська&nbsp;обл., с.&nbsp;Годовиця
        </p>
      </div>
      <div>
        <h3 className="text-[20px] l:text-[32px] font-medium mb-5">Контакти</h3>
        <Link
          href={"tel:+380970707207"}
          className="font-montserrat text-md-responsive font-normal"
        >
          +38 (097) 07 07 207
        </Link>
      </div>
      <div>
        <h3 className="text-[20px] l:text-[32px] font-medium mb-5">
          Графік роботи
        </h3>
        <p className="font-montserrat text-md-responsive font-normal mb-4">
          Пн - Пт : 09.00 - 18.00
        </p>
        <p className="font-montserrat text-md-responsive font-normal ">
          Сб : 10.00 - 17.00
        </p>
      </div>
      <SocLinks />
    </div>
  );
}
