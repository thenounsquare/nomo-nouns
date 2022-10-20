import { useEffect, useState } from "react";

export const currentTimestamp = () => Math.floor(Date.now() / 1000);

export const useTimestamp = () => {
  const [now, setNow] = useState<number>(currentTimestamp());
  useEffect(() => {
    const interval = setInterval(() => setNow(currentTimestamp()), 1000);

    return () => clearInterval(interval);
  }, []);

  return now;
};
