import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import Footer from "./components/modules/Footer/Footer";
import Header from "./components/modules/Header/Header";
import Head from "next/head";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const michelin = localFont({
  src: [
    {
      path: "../../public/fonts/Michelin-Bold.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/Michelin-SemiBold.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Michelin-Regular.ttf",
      weight: "400",
      style: "italic",
    },
  ],
});

export const metadata = {
  title: "IceLab",
  description: "Сухий лід для будь-яких потреб - завжди в наявності",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.className} ${michelin.className}`}>
      <Head>
        <meta name="description" content={metadata.description} />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="ICELAB" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className="leading-[1.2] italic bg-white">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
