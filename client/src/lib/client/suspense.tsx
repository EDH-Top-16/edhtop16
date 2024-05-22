import { Suspense, SuspenseProps, useEffect, useState } from "react";

export function useMounted() {
  const [isMounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return isMounted;
}

export function ServerSafeSuspense(props: SuspenseProps) {
  const isMounted = useMounted();

  if (!isMounted) {
    return props.fallback;
  } else {
    return <Suspense {...props} />;
  }
}
