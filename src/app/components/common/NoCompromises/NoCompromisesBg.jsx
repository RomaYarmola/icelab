"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useIsSafari } from "@/hooks/useIsSafari";

export default function NoCompromisesBg() {
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

  return (
    <>
      {!isSafari && (
        <>
          <div className="radial-vertical-gradient w-[212%] md:w-[60%] absolute right-[6%] top-[-365px] md:right-[42%] z-[3]" />
          <div className="radial-vertical-gradient w-[212%] md:w-[60%] absolute left-[12%] md:left-[42.4%] top-[-365px] z-[3]" />
          <div className="radial-dark-gradient w-[154.7%] h-[717px] absolute left-1/2 transform -translate-x-1/2  top-[-367px] md:top-[-311px]" />
          <div className="radial-dark-gradient w-[154.7%] h-[717px] absolute left-1/2 transform -translate-x-1/2  top-[56px] md:top-[-30px]" />
          <div className="radial-small-gradient absolute hidden md:block left-[-5.3%] top-[-150px] z-[4]" />
          <div className="radial-small-gradient absolute hidden md:block right-[-4.9%] top-[-150px] z-[4]" />
        </>
      )}

      <>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom="right"
          variants={cloudVariants}
          className="absolute h-[259px] md:h-[396px] z-[6] top-[-206px] md:top-[-282px] left-0 md:left-[52.3%] pointer-events-none"
        >
          <Image
            src="/images/hero/cloud-right.png"
            alt="cloud"
            width={812}
            height={289}
            className="h-full w-full object-cover object-left"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom="left"
          variants={cloudVariants}
          className="hidden md:block absolute h-[396px] z-[6] top-[-302px] right-[56.6%] pointer-events-none"
        >
          <Image
            src="/images/hero/cloud-left.png"
            alt="cloud"
            width={812}
            height={289}
            className="h-full w-full object-cover object-right"
          />
        </motion.div>

        {!isSafari && (
          <>
            {" "}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom="left"
              variants={cloudVariants}
              className="hidden md:block absolute h-[568px] w-[20.6%] top-[-126px] left-0 z-[1]"
            >
              <Image
                src="/images/no-compromises/bg-left.png"
                alt="cloud"
                width={200}
                height={568}
                className="h-full w-full object-cover object-left"
                quality={100}
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom="right"
              variants={cloudVariants}
              className="hidden md:block absolute h-[568px] w-[20.6%] top-[-126px] right-0 z-[1]"
            >
              <Image
                src="/images/no-compromises/bg-right.png"
                alt="cloud"
                width={200}
                height={568}
                className="h-full w-full object-cover object-left"
                quality={100}
              />
            </motion.div>
          </>
        )}
      </>
    </>
  );
}
