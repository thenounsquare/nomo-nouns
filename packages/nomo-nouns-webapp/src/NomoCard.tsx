import {
  HStack,
  Image,
  keyframes,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
// import { ImageData } from "@nouns/assets";
import { ImageData } from "@nomonouns/assets";
import party, { Vector } from "party-js";
import { FC, useEffect, useMemo, useRef } from "react";
import {
  IoHeart,
  IoHeartDislike,
  IoHeartDislikeOutline,
  IoHeartOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";
import { BlockTally, Match } from "../common/match";
import { EmitterConstructionOptions } from "party-js/lib/particles/emitter";
import { useNomoImage } from "./components/NomoImage";
import { useAccount } from "wagmi";

const {
  palette,
  bgcolors,
  images: { glasses, accessories, bodies, heads },
} = ImageData;

export type NomoCardProps = {
  walletDisqualified?: boolean;
  onVote?: () => void;
  nounId: number;
  tally: BlockTally;
  match: Match;
} & StackProps;

export const NomoCard: FC<NomoCardProps> = ({
  walletDisqualified = false,
  nounId,
  match,
  tally: { block, roundVotes, totalVotes, eliminated, dueForElimination },
  onVote,
  ...props
}) => {
  const { isConnected } = useAccount();
  const imageRef = useRef<HTMLImageElement>(null);
  const prevVotesRef = useRef<number | undefined>(undefined);
  const currentStage =
    match.status === "Active" ? match.currentStage.name : "None";

  const isElectedNomo =
    (match.status === "Selling" &&
      match.electedNomoTally.block.number === block.number) ||
    (match.status === "Active" &&
      match.currentStage.name === "Celebration" &&
      match.tally.blocks.filter((block) => !block.eliminated)[0].block
        .number === block.number);

  const { nomoImage, nomoHeadImage } = useNomoImage(block.seed);

  const nounfetti = useNounfettiEmitter(nomoHeadImage);

  useEffect(() => {
    if (
      imageRef.current &&
      prevVotesRef.current &&
      roundVotes > prevVotesRef.current
    ) {
      nounfetti.shoot(
        Math.min(roundVotes - prevVotesRef.current, 5),
        imageRef.current
      );
    }
    prevVotesRef.current = roundVotes;
  }, [roundVotes, imageRef.current]);

  useEffect(() => {
    if (imageRef.current && currentStage === "Celebration" && isElectedNomo) {
      setTimeout(() => nounfetti.fountain(imageRef.current!, 9), 1000);
    }
  }, [currentStage, isElectedNomo]);

  const voteCount = eliminated ? totalVotes : roundVotes;
  const Icon =
    voteCount > 0
      ? eliminated
        ? IoHeartDislike
        : IoHeart
      : eliminated
      ? IoHeartDislikeOutline
      : IoHeartOutline;

  const votingEnabled =
    isConnected &&
    !walletDisqualified &&
    match.status === "Active" &&
    match.currentStage.votingEnabled;

  return (
    <VStack
      zIndex={isElectedNomo ? 100000 : undefined}
      userSelect={"none"}
      as={motion.div}
      layoutId={block.number}
      // borderWidth={1}
      mb={votingEnabled ? 0 : 6}
      overflow={"clip"}
      borderRadius={"md"}
      {...props}
      cursor={votingEnabled ? "pointer" : undefined}
      onContextMenu={(e) => e.preventDefault()}
      onClick={
        votingEnabled
          ? (e) => {
              e.preventDefault();
              if (onVote) onVote();
            }
          : undefined
      }
      spacing={0}
      shadow={votingEnabled ? "sm" : undefined}
      _hover={{
        shadow: votingEnabled ? "base" : undefined,
      }}
      _active={{ shadow: votingEnabled ? "inner" : undefined }}
      animation={
        votingEnabled &&
        !eliminated &&
        dueForElimination &&
        match.status === "Active" &&
        match.currentStage.name === "Round" &&
        match.currentStageTimeLeft <= 5
          ? `${shaking} 0.3s infinite, ${blinkingGrayscale} 0.5s alternate infinite`
          : undefined
      }
    >
      <Image
        w={"full"}
        ref={imageRef}
        src={nomoImage}
        draggable={false}
        filter={eliminated ? "grayscale(100%)" : undefined}
      />

      {votingEnabled && (
        <HStack
          borderWidth={1}
          borderTopWidth={0}
          borderBottomRadius={"md"}
          w={"full"}
          h={6}
          px={2}
        >
          <Icon color={"gray"} size={14} width={2} />
          {voteCount > 0 && <Text fontSize={"12px"}>{voteCount}</Text>}
        </HStack>
      )}
    </VStack>
  );
};

const shaking = keyframes`
  0% {
    transform: translateX(0)
  }
  25% {
    transform: translateX(4px)
  }
  50% {
    transform: translateX(-4px)
  }
  75% {
    transform: translateX(4px)
  }
  100% {
    transform: translateX(0)
  }
`;

const blinkingGrayscale = keyframes`
  from {
    filter: none
  }
  to {
    filter: grayscale(100%)
  }
`;

const useNounfettiEmitter = (svgString: string) => {
  const nounHead = useMemo(() => {
    const div = document.createElement("div");
    div.innerHTML = svgString;
    div.style.transformOrigin = "top left";
    div.style.background = "transparent";

    return div;
  }, [svgString]);

  const emitterOptions: EmitterConstructionOptions["emitterOptions"] = {
    loops: 1,
    useGravity: true,
    modules: [
      new party.ModuleBuilder()
        .drive("rotation")
        .by((t) => new party.Vector(0, 0, 200).scale(t))
        .relative()
        .build(),
    ],
  };

  const baseEmissionOptions: (
    element: HTMLElement
  ) => Partial<EmitterConstructionOptions["emissionOptions"]> = (element) => {
    const { x, y, width, height } = element.getBoundingClientRect();
    return {
      rate: 0,
      sourceSampler: () => new Vector(x + width / 2, y + height / 2),
      angle: party.variation.range(225, 315),
      initialSize: party.variation.range(0.05, 0.2),
      initialSpeed: party.variation.range(400, 800),
    };
  };

  const rendererOptions: EmitterConstructionOptions["rendererOptions"] = {
    shapeFactory: nounHead,
    applyLighting: undefined,
    applyColor: undefined,

    applyTransform: (particle, element) => {
      const { width, height } = element.getBoundingClientRect();
      const svg = element.getElementsByTagName("svg")[0];
      svg.style.transform =
        "rotateZ(" + particle.rotation.z.toFixed(3) + "deg) ";

      element.style.transform =
        "translateX(" +
        (
          particle.location.x -
          (width * particle.size) / 2 -
          window.scrollX
        ).toFixed(3) +
        "px) " +
        "translateY(" +
        (
          particle.location.y -
          (height * particle.size) / 2 -
          window.scrollY
        ).toFixed(3) +
        "px) " +
        "scale(" +
        particle.size.toFixed(3) +
        ")";
    },
  };
  return {
    shoot: (amount: number, element: HTMLElement) => {
      party.scene.current.createEmitter({
        emitterOptions,
        emissionOptions: {
          ...baseEmissionOptions(element),
          bursts: [{ time: 0, count: amount }],
        },
        rendererOptions,
      });
    },
    fountain: (element: HTMLElement, duration: number) => {
      party.scene.current.createEmitter({
        emitterOptions: { ...emitterOptions, duration },
        emissionOptions: {
          ...baseEmissionOptions(element),
          rate: 25,
          initialSpeed: party.variation.range(600, 1200),
        },
        rendererOptions,
      });
    },
  };
};
