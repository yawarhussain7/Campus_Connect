import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-reveal wrapper. Fades and lifts its children into view the first time
 * they enter the viewport, then disconnects the observer so it never repeats.
 *
 * Falls back to "already visible" when IntersectionObserver is unavailable so
 * content is never left hidden. Motion itself is switched off by the global
 * `prefers-reduced-motion` rule in index.css.
 */
const Reveal = ({ children, className = '', delay = 0, as: Tag = 'div' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${visible ? 'reveal-in' : ''} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
