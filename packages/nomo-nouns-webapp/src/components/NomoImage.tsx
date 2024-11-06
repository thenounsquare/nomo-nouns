// import { NounSeed } from "@nouns/assets/dist/types";
import { NounSeed } from "@nomonouns/assets/dist/types";
import { useMemo } from "react";
// import { getNounData, ImageData } from "@nouns/assets";
import { getNounData, ImageData } from "@nomonouns/assets";
import { buildSVG } from "@nouns/sdk";

const { palette } = ImageData;

export const useNomoImage = (seed: NounSeed) => {
  return useMemo(() => {
    const { parts, background } = getNounData(seed);
    const [, , head, noggles] = parts;

    return {
      nomoImage: `data:image/svg+xml;base64,${btoa(
        buildSVG(parts, palette, getBgOverride(background))
      )}`,
      nomoHeadImage: buildSVG([head, noggles], palette, "00000000"),
    };
  }, [seed]);
};

const getBgOverride = (bg: string) => {
  switch (bg) {
    case "d5d7e1":
      return "ff3260";
    case "e1d7d5":
      return "fccb09";
    default:
      return bg;
  }
};
