// Root layout — html/body are rendered by app/[locale]/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement
}
