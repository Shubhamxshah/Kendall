import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/helpers/authContext';

export const metadata: Metadata = {
  title: 'turborepo-shadcn-tailwind-v4',
  description: 'Turborepo-Shadcn-Tailwind CSS v4 Boilerplate',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <AuthProvider>
        {children}
      </AuthProvider>
      </body>
    </html>
  );
}
