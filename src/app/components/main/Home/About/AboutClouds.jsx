"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useIsSafari } from "@/hooks/useIsSafari";

export default function AboutClouds() {
  const isSafari = useIsSafari();

  const cloudVariants = {
    hidden: (direction) => ({
      x: direction === "left" ? "-100%" : "100%",
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeOut",
      },
    },
  };

  if (typeof window === "undefined" || isSafari === null) return null;

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom="left"
        variants={cloudVariants}
        className="hidden md:block absolute h-[264px] z-[3] top-[58px] md:top-[149px] right-[41px] md:right-[52%] l:h-[396px] 2xl:h-[56%]"
      >
        <Image
          src="/images/hero/cloud-left.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
          priority
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom="left"
        variants={cloudVariants}
        className={`absolute h-[264px] z-[3] top-[71px] ${
          isSafari ? "right-0" : "right-[-608px]"
        }  md:hidden`}
      >
        <Image
          src="/images/hero/cloud-left.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
          priority
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom="left"
        variants={cloudVariants}
        className={`absolute h-[346px] l:h-[396px] 2xl:h-[56%] z-[4] top-[737px] md:top-[159px] ${
          isSafari ? "right-0" : "right-[64px] md:right-[-35%]"
        }  `}
      >
        <Image
          src="/images/hero/cloud-right.png"
          alt="cloud"
          width={812}
          height={289}
          className={`w-full object-cover  ${
            isSafari ? "" : "object-right h-full "
          }`}
          priority
        />
      </motion.div>
    </>
  );
}
