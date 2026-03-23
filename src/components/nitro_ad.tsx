import {useEffect, useRef} from 'react';

type AdSize = [string, string];

interface NitroAdProps {
  id: string;
  sizes: AdSize[];
  options?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
}

function pickSize(sizes: AdSize[], containerWidth: number): AdSize | null {
  let best: AdSize | null = null;
  let bestWidth = 0;
  for (const size of sizes) {
    const w = Number(size[0]);
    if (w <= containerWidth && w > bestWidth) {
      best = size;
      bestWidth = w;
    }
  }
  return best;
}

export function NitroAd({id, sizes, options, className, style}: NitroAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !window.nitroAds || !containerRef.current)
      return;
    initialized.current = true;

    const width = containerRef.current.clientWidth;
    const size = pickSize(sizes, width);
    if (!size) return;

    window.nitroAds.createAd(id, {
      refreshLimit: 10,
      refreshTime: 30,
      renderVisibleOnly: true,
      refreshVisibleOnly: true,
      sizes: [size],
      ...options,
    });
  }, [id, sizes, options]);

  return (
    <div ref={containerRef} className={className} style={style}>
      <div id={id} />
    </div>
  );
}
