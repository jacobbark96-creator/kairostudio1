import '../src/index.css';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/hooks/useTheme';
import { UIProvider } from '../src/context/UIContext';
import RootWrapper from './RootWrapper';
import React from 'react';

export const metadata = {
  title: 'Kairo Studio | High-Performance Digital Solutions',
  description: 'We build high-performance websites and digital products.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <UIProvider>
              <RootWrapper>{children}</RootWrapper>
            </UIProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
