import { HStack, Image, Link, Text, Tooltip } from "@chakra-ui/react";
import volky from "../assets/volky.png";

import { ConnectKitButton } from "connectkit";
import { useActiveUserCount } from "../hooks/session";
import { useIsMobile } from "../hooks/isMobile";
import { EtherscanIcon, OpenSeaIcon } from "./Icons";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";

export const Footer = () => {
  const activeUserCount = useActiveUserCount();
  const isMobile = useIsMobile();

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

      <HStack>
        <Link isExternal href={"https://twitter.com/thenounsquare"}>
          <FaTwitter size={24} />
        </Link>
        <Link isExternal href={"https://discord.gg/qanyJqydYt"}>
          <FaDiscord size={24} />
        </Link>
        <Link isExternal href={"https://opensea.io/collection/nomo-nouns"}>
          <OpenSeaIcon boxSize={"24px"} />
        </Link>
        <Link
          isExternal
          href={
            "https://etherscan.io/address/0xbe37CC3F8f7E1E4C264Ba5818482fA75e2D1823e"
          }
        >
          <EtherscanIcon boxSize={"24px"} />
        </Link>
        <Link isExternal href={"https://github.com/volkyeth/nomo-nouns"}>
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
