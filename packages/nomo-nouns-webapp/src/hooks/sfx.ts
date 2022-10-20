import { useAppState } from "../state/appState";
import buttonSfx1 from "../assets/button_mash.mp3";
import buttonSfx2 from "../assets/button2.mp3";
import buttonSfx4 from "../assets/button4.mp3";
import buttonSfx5 from "../assets/button5.mp3";
import { useEffect, useMemo, useRef } from "react";
import { sample, times } from "lodash";
import { ActiveMatch, StageName } from "../../common/match";
import airhornSfx from "../assets/airhorn_winner.mp3";
import marioKartCountdownSfx from "../assets/MarioKartCountdown.mp3";
import { Howl } from "howler";
import roundTrack from "../assets/15sec.mp3";
import preparingMatchTrack from "../assets/1min_waiting.mp3";
import preparingFinalMashTrack from "../assets/10sec_countdown.mp3";

export const useVoteSfx = (votes?: number) => {
  const soundEnabled = useAppState((state) => state.soundEnabled);
  const sfx = [
    useHowl(buttonSfx1),
    useHowl(buttonSfx2),
    useHowl(buttonSfx4),
    useHowl(buttonSfx5),
  ];
  const prevVotes = useRef<number>();

  useEffect(() => {
    if (
      soundEnabled &&
      prevVotes.current &&
      votes &&
      votes > prevVotes.current
    ) {
      times(votes - prevVotes.current, () => sample(sfx)!.play());
    }

    prevVotes.current = votes;
  }, [votes, soundEnabled]);
};

export const useWinnerSfx = (match: ActiveMatch) => {
  const soundEnabled = useAppState((state) => state.soundEnabled);
  const prevStageRef = useRef<StageName | undefined>(undefined);
  const airhorn = useHowl(airhornSfx);
  useEffect(() => {
    if (
      soundEnabled &&
      prevStageRef.current &&
      prevStageRef.current === "Final Mash" &&
      match.currentStage.name === "Celebration"
    ) {
      airhorn.play();
    }
    prevStageRef.current = match.currentStage.name;
  }, [match.currentStage.name]);
};

export const useCountdownSfx = (match: ActiveMatch) => {
  const marioKartCountdown = useHowl(marioKartCountdownSfx);
  useEffect(() => {
    if (
      (match.currentStage.name === "Warmup" ||
        match.currentStage.name === "Interlude") &&
      match.currentStageTimeLeft === 3
    ) {
      marioKartCountdown.play();
    }
  }, [match.currentStage.name, match.currentStageTimeLeft]);
};

export const useHowl = (src: string) =>
  useMemo(
    () =>
      new Howl({
        src,
      }),
    []
  );

export const useSoundtrack = (
  stage: StageName | null,
  stageElapsedTime: number,
  currentRound: number
) => {
  const soundEnabled = useAppState((state) => state.soundEnabled);
  const roundSoundtrack = useHowl(roundTrack);
  const soundtrack: Partial<{ [stage in StageName]: Howl }> = {
    Warmup: useHowl(preparingMatchTrack),
    Interlude: useHowl(preparingFinalMashTrack),
    Round: roundSoundtrack,
    "Final Mash": roundSoundtrack,
  };

  useEffect(() => {
    if (!stage || soundtrack[stage] === undefined || !soundEnabled) {
      return;
    }

    soundtrack[stage]?.seek(stageElapsedTime);
    soundtrack[stage]?.play();

    return () => {
      soundtrack[stage]?.stop();
    };
  }, [stage, soundEnabled, currentRound]);
};

const useAutoplayOnFirstInteraction = (
  setSoundEnabled: (enabled: boolean) => void
) => {
  const enableSound = () => setSoundEnabled(true);
  useEffect(() => {
    ["mousedown", "touchstart"].forEach((e) =>
      document.addEventListener(e, enableSound, { once: true })
    );
    return () =>
      ["mousedown", "touchstart"].forEach((e) =>
        document.removeEventListener(e, enableSound)
      );
  }, []);
};
