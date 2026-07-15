import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://aurumarquitectos.github.io"),
    title: "Aurum Arquitectos | Arquitectura para tu forma de vivir",
    description:
      "Arquitectura e interiores de autor en Hermosillo, Sonora. Residencias con identidad, claridad y valor que permanece.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Aurum Arquitectos",
      description: "Tu forma de vivir. Hecha arquitectura.",
      type: "website",
      locale: "es_MX",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Aurum Arquitectos — Tu forma de vivir. Hecha arquitectura." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Aurum Arquitectos",
      description: "Tu forma de vivir. Hecha arquitectura.",
      images: ["/og.png"],
    },
  };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
