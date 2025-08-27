import Image from "next/image";
import { data } from "./data";

export default function Details() {
  return (
    <div className="flex flex-col gap-5">
      {data.map(({ question, answer }, index) => (
        <details
          key={index}
          className=" text-white text-xs-responsive font-montserrat not-italic rounded-[18px] bg-commonBlue cursor-pointer px-4 md:px-8 py-7"
        >
          <summary className="  questionBlock flex justify-between font-michelin">
            <p className="text-md-responsive text-white font-medium font-michelin">
              {question}
            </p>
            <Image
              src="/icons/expand-more.svg"
              alt="icon"
              width={32}
              height={32}
              className="svg rotate-180"
            />
          </summary>
          <p className="mt-4" dangerouslySetInnerHTML={{ __html: answer }} />
        </details>
      ))}
    </div>
  );
}
