import "@/styles/globals.css";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MenuOverlay from '@/components/MenuOverlay';

export default function App({ Component, pageProps }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      // Close menu when route change completes (new page loaded)
      setIsMenuOpen(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      // We can determine active item from router.pathname directly in MenuOverlay, 
      // passing it explicitly is also fine but let's let MenuOverlay handle it or derived logic here.
      // For now, removing defaultActiveItem prop usage in favor of checking router inside MenuOverlay or passing calculated one.
      />
      <Component {...pageProps} onOpenMenu={() => setIsMenuOpen(true)} />
    </>
  );
}
