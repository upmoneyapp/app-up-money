import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UP Money - Desligue o piloto automático e assuma o controle da sua vida financeira",
  description: "Recupere o domínio da sua renda com o método 60/30/10. Simples, visual e realista.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UP Money",
    startupImage: [
      {
        url: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/83aa3506-8236-4455-8319-74f99c4cb14b.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
      }
    ]
  },
  icons: {
    icon: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/83aa3506-8236-4455-8319-74f99c4cb14b.png",
    apple: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/83aa3506-8236-4455-8319-74f99c4cb14b.png",
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
        <link rel="apple-touch-icon" href="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/83aa3506-8236-4455-8319-74f99c4cb14b.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UP Money" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
