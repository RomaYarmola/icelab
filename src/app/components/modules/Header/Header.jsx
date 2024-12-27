"use client";

import React, { useRef, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  Link,
} from "@nextui-org/react";
import Image from "next/image";
import BurgerMenu from "./BurgerMenu";
import Navigation from "./Navigation";
import useProductStore from "@/zustand/store/productStore";
import BasketModal from "./BasketModal";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isBasketModalOpen, setIsBasketModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();
  const products = useProductStore((state) => state.products);
  const productsQuantity = products.length;
  const totalValue = products.reduce((accumulator, product) => {
    return accumulator + parseFloat(product.totalPrice);
  }, 0);

  const handleBackdropMouseLeave = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsBasketModalOpen(false);
    }
  };

  return (
    <div className="bg-white  fixed top-0 w-full z-50">
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className={`mx-auto navbar max-w-[1280px] px-4 l:px-20 pt-2 pb-2 bg-transparent backdrop-blur-none `}
      >
        {/* Брендинг */}
        <NavbarContent>
          <NavbarBrand>
            <Link href="/">
              <Image src="/icons/logo.svg" alt="logo" width={61} height={53} />
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <div className="flex items-center gap-12">
          {/* Навигационные ссылки для десктопа */}
          <Navigation />
          <Link
            onMouseEnter={() => setIsBasketModalOpen(true)}
            onClick={() => {
              router.push("/basket");
              setIsBasketModalOpen(false);
            }}
            href="/basket"
            className="relative"
          >
            <Image
              src="/icons/basket.svg"
              alt="basket icon"
              width={36}
              height={36}
            />
            {productsQuantity > 0 && (
              <div className="rounded-full w-5 h-5 bg-commonBlue800 absolute  right-[60%] top-[-50%] translate-y-1/2 flex justify-center items-center z-[1]">
                <p className="text-white font-montserrat not-italic text-[12px]">
                  {productsQuantity}
                </p>
              </div>
            )}
          </Link>
        </div>

        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden w-9 h-9"
        />

        {/* Бургер-меню */}
        <BurgerMenu
          onClick={() => {
            setIsMenuOpen(false);
          }}
        />
      </Navbar>
      {isBasketModalOpen && (
        <BasketModal
          handleBackdropMouseLeave={handleBackdropMouseLeave}
          modalRef={modalRef}
          totalValue={totalValue}
          products={products}
        />
      )}
    </div>
  );
}
