import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { FloatingHearts } from "@/components/floating-hearts";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Íntimo y Casual",
  description:
    "Lencería y ropa interior para Colombia. Envíos discretos, pago seguro.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FloatingHearts />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
