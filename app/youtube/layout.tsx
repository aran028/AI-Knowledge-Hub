import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s - AI Knowledge Hub",
    default: "YouTube - AI Knowledge Hub",
  },
  description: "Contenido de YouTube clasificado automáticamente con IA",
}

export default function YouTubeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}