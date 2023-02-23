import { useFirebaseState } from "../state/firebaseState";
import { useEffect, useState } from "react";
import { useTimestamp } from "./useTimestamp";
import {
  onValue,
  orderByValue,
  query,
  ref,
  remove,
  serverTimestamp,
  set,
  startAt,
} from "firebase/database";
import { useAccount } from "wagmi";
import { useIdleTimer } from "react-idle-timer";

export const useCountActiveUsers = () => {
  const db = useFirebaseState((state) => state.db);
  const { address } = useAccount();

  const onAction = () => {
    if (!address) {
      return;
    }

    set(ref(db, `userActivity/${address}`), serverTimestamp());
  };

  useIdleTimer({
    onAction,
    throttle: 10_000,
  });

  useEffect(() => {
    onAction();

    return () => {
      remove(ref(db, `userActivity/${address}`));
    };
  }, [address]);
};

export const useActiveUserCount = () => {
  const db = useFirebaseState((state) => state.db);
  const [activeUserCount, setActiveUserCount] = useState<number>();
  const currentTimestamp = useTimestamp() * 1000;

  useEffect(() => {
    return onValue(
      query(
        ref(db, "userActivity"),
        orderByValue(),
        startAt(currentTimestamp - 60_000)
      ),
      (s) => {
        const userActivity = s.val();

        const activeUserCount = (Object.values(userActivity ?? {}) as number[])
          .length;
        setActiveUserCount(activeUserCount);
      }
    );
  }, []);

  return activeUserCount;
};

export const useIdleDetection = () => {
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const onIdle = () => setIsIdle(true);
  const onActive = () => setIsIdle(false);

  useIdleTimer({
    onIdle,
    onActive,
    timeout: 1000 * 5 * 60,
    throttle: 10_000,
  });
  return isIdle;
};
