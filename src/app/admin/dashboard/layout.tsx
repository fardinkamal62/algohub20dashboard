import type { Metadata } from "next";
import "../../globals.css";


export const metadata: Metadata = {
    title: "Algohub 2.0 Admin Panel",
    description: "Manage teams and scores for the Algohub 2.0 course",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <body>
        {children}
        </body>
    );
}
