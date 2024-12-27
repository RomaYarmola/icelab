"use client";
import { withLoader } from "@/helpers/withLoader";
import NoCompromises from "./components/common/NoCompromises/NoCompromises";
import About from "./components/main/Home/About/About";
import Faq from "./components/main/Home/Faq/Faq";
import Hero from "./components/main/Home/Hero/Hero";
import Products from "./components/main/Home/Products.jsx/Products";

function Home() {
  return (
    <>
      <Hero />
      <Products />
      <About />
      <Faq />
      <NoCompromises />
    </>
  );
}

export default withLoader(Home);
