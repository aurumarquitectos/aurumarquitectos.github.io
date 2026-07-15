import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
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
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "Aurum Arquitectos — Tu forma de vivir. Hecha arquitectura." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Aurum Arquitectos",
      description: "Tu forma de vivir. Hecha arquitectura.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
