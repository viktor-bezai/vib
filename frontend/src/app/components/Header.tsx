'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', backgroundColor: '#0066cc', color: '#fff' }}>
      <div>
        <h1>LearnEnglish</h1>
      </div>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '1.5rem', margin: 0, padding: 0 }}>
          <li>
            <Link href="/" style={{ color: pathname === '/' ? '#ffcc00' : '#fff', textDecoration: 'none' }}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" style={{ color: pathname === '/about' ? '#ffcc00' : '#fff', textDecoration: 'none' }}>
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" style={{ color: pathname === '/contact' ? '#ffcc00' : '#fff', textDecoration: 'none' }}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
