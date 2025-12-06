import "@/styles/globals.css";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MenuOverlay from '@/components/MenuOverlay';

export default function App({ Component, pageProps }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const triggerTransition = (url) => {
    setIsTransitioning(true);
    setIsMenuOpen(true);
    setTimeout(() => {
      router.push(url);
    }, 800); // Wait for slide down (approx 700ms - 800ms)
  };

  useEffect(() => {
    const handleRouteChange = () => {
      // Close menu when route change completes
      setIsMenuOpen(false);
      // Reset transition state after slide up completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
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
        showContent={!isTransitioning}
      />
      <Component {...pageProps} onOpenMenu={() => setIsMenuOpen(true)} onTriggerTransition={triggerTransition} />
    </>
  );
}
