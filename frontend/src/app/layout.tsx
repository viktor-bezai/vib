// app/layout.tsx
import './globals.css';
import Header from './components/Header';

export const metadata = {
  title: 'LearnEnglish',
  description: 'A platform to master the English language.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
