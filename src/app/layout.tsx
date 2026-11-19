import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bento',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <head>
        {/* Overridable instance CSS file for custom styling */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/public/styles/instance.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
