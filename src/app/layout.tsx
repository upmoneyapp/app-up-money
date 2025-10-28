import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UP Money - Desligue o piloto automático e assuma o controle da sua vida financeira",
  description: "Recupere o domínio da sua renda com o método 60/30/10. Simples, visual e realista.",
  icons: {
    icon: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/83aa3506-8236-4455-8319-74f99c4cb14b.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/83aa3506-8236-4455-8319-74f99c4cb14b.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}