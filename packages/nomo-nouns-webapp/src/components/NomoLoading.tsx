import Nomoggles from "../assets/nomoggles.svg";
import { Image, ImageProps } from "@chakra-ui/react";
import { FC } from "react";
import { keyframes } from '@emotion/react';

export const NomoLoading: FC<Omit<ImageProps, "src">> = (props) => {
  return (
    <Image
      src={Nomoggles}
      animation={`${pulsating} 1s ease-in-out infinite alternate `}
      {...props}
    />
  );
};

const pulsating = keyframes`
  from {
    opacity: 0.4;
  }
  to {
    opacity: 0.2;
  }
`;
