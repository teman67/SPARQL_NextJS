import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "SPARQL Query App",
  description: "Run SPARQL queries interactively",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
