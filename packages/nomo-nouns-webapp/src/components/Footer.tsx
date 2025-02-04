import { HStack, Image, Link, Text, Tooltip, Box } from "@chakra-ui/react";
import volky from "../assets/volky.png";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";
import { ConnectKitButton } from "connectkit";
import { useActiveUserCount } from "../hooks/session";
import { useIsMobile } from "../hooks/isMobile";
import { EtherscanIcon, OptimismScanIcon, OpenSeaIcon, FarcasterIcon } from "./Icons";

export const Footer = () => {
  const activeUserCount = useActiveUserCount();
  const isMobile = useIsMobile();
  const TwitterXIcon = () => {
    return (
      <Box position="relative" w="22px" h="24px">
        <Box
          position="absolute"
          opacity={1}
          _groupHover={{ opacity: 0 }}
          transition="opacity 0.2s"
        >
          <FaXTwitter size={24} />
        </Box>
        <Box
          position="absolute"
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.2s"
        >
          <FaTwitter size={22} />
        </Box>
      </Box>
    );
  };

  return (
    <HStack
      borderTopWidth={1}
      bgColor={"var(--chakra-colors-chakra-body-bg)"}
      w={"full"}
      p={2}
      justifyContent={isMobile ? "space-between" : "end"}
    >
      {isMobile && <ConnectKitButton label={"Connect to play"} />}

      {isMobile && activeUserCount && activeUserCount > 0 && (
        <Tooltip hasArrow label={"Connected players"}>
          <HStack>
            <Text>{activeUserCount}</Text>
            <HiUsers />
          </HStack>
        </Tooltip>
      )}

      <HStack spacing={3} align="center">
        {/* <Link isExternal href={"https://x.com/zerorightsmedia"}>
          <FaXTwitter size={24} />
        </Link> */}
        <Link isExternal href={"https://x.com/zerorightsmedia"} role="group">
          <TwitterXIcon />
        </Link>
        <Link isExternal href={"https://warpcast.com/zerorightsmedia"}>
          <FarcasterIcon boxSize="22px" />
        </Link>
        <Link isExternal href={"https://discord.gg/qanyJqydYt"}>
          <FaDiscord size={24} />
        </Link>
        <Link isExternal href={"https://opensea.io/collection/nomo-nouns-2"}>
          <OpenSeaIcon boxSize="24px" />
        </Link>
        <Link
          isExternal
          href={
            "https://optimistic.etherscan.io/token/0x1464ebbf9ecd642d42db8e8827919fdd4a786987"
          }
        >
          <OptimismScanIcon boxSize="24px" />
        </Link>
        <Link isExternal href={"https://github.com/thenounsquare/nomo-nouns"}>
          <FaGithub size={24} />
        </Link>
        <Tooltip hasArrow label={"by Volky"}>
          <Link isExternal href={"https://twitter.com/volkyeth"}>
            <Image src={volky} h={"24px"} />
          </Link>
        </Tooltip>
      </HStack>
    </HStack>
  );
};
