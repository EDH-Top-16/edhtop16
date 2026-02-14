import {useEffect, useRef} from 'react';

interface NitroAdProps {
  id: string;
  options?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
}

export function NitroAd({id, options, className, style}: NitroAdProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !window.nitroAds) return;
    initialized.current = true;

    window.nitroAds.createAd(id, {
      refreshLimit: 10,
      refreshTime: 30,
      renderVisibleOnly: true,
      refreshVisibleOnly: true,
      ...options,
    });
  }, [id, options]);

  return <div id={id} className={className} style={style} />;
}
