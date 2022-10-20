import {
  Button,
  Center,
  chakra,
  Heading,
  HStack,
  IconButton,
  Image,
  keyframes,
  Link,
  Text,
  Tooltip,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import Nomoggles from "../assets/nomoggles.svg";
import { HiUsers, MdMusicNote, MdMusicOff } from "react-icons/all";
import { ConnectKitButton } from "connectkit";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useAppState } from "../state/appState";
import { useActiveUserCount } from "../hooks/session";
import { useState } from "react";
import { useIsMobile } from "../hooks/isMobile";

export const Footer = () => {
  const activeUserCount = useActiveUserCount();

  return (
    <HStack
      borderTopWidth={1}
      bgColor={"var(--chakra-colors-chakra-body-bg)"}
      w={"full"}
      p={2}
      justifyContent={"space-between"}
    >
      <ConnectKitButton label={"Connect to play"} />
      {activeUserCount && (
        <Tooltip hasArrow label={"Connected players"}>
          <HStack>
            <Text>{activeUserCount}</Text>
            <HiUsers />
          </HStack>
        </Tooltip>
      )}
      <HStack>
        <Link isExternal href={"https://twitter.com/thenounsquare"}>
          <Button fontSize={"xs"}>NOC</Button>
        </Link>
        <Link isExternal href={"https://fomonouns.wtf/"}>
          <Button fontSize={"xs"}>FOMO</Button>
        </Link>
      </HStack>
    </HStack>
  );
};
