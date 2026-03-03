import "./globals.css";

export const metadata = {
    title: "Smith Assistant – Travel Smith Goa",
    description: "Official AI travel assistant for Travel Smith Goa",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>{children}</body>
        </html>
    );
}
