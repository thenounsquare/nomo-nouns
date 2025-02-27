import {
  chakra,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  Tooltip,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import Nomoggles from "../assets/nomoggles.svg";
import { HiUser, HiUsers } from "react-icons/hi";
import { MdMusicNote, MdMusicOff } from "react-icons/md";
import { ConnectKitButton } from "connectkit";
import { MoonIcon, SunIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useAppState } from "../state/appState";
import { useActiveUserCount } from "../hooks/session";
import { useEffect, useState } from "react";
import { useIsMobile } from "../hooks/isMobile";
import { keyframes } from '@emotion/react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { optimism, optimismGoerli, mainnet, sepolia } from 'wagmi/chains';

export const Header = () => {
  const { soundEnabled, toggleSound } = useAppState();
  const [showSoundTooltip, setShowSoundTooltip] = useState<true | undefined>(
    true
  );
  const { toggleColorMode, colorMode } = useColorMode();
  const isMobile = useIsMobile();
  const activeUserCount = useActiveUserCount();
  
  // Network switching functionality
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  
  // Define available networks based on environment
  const networks = import.meta.env.PROD 
    ? [
        { name: "Optimism", chain: optimism },
        { name: "Ethereum", chain: mainnet }
      ]
    : [
        { name: "Optimism Goerli", chain: optimismGoerli },
        { name: "Sepolia", chain: sepolia }
      ];

  useEffect(() => {
    const hideSoundTooltip = () => {
      setShowSoundTooltip(undefined);
    };
    document.addEventListener("click", hideSoundTooltip);
    document.addEventListener("touchstart", hideSoundTooltip);
    document.addEventListener("scroll", hideSoundTooltip);
    return () => {
      document.removeEventListener("click", hideSoundTooltip);
      document.removeEventListener("touchstart", hideSoundTooltip);
      document.removeEventListener("scroll", hideSoundTooltip);
    };
  }, []);

  return (
    <HStack
      w={"full"}
      px={[4, 10]}
      py={[4, 6]}
      justifyContent={"space-between"}
      borderBottomWidth={1}
    >
      <HStack w={"fit-content"}>
        <Image src={Nomoggles} h={"32px"} />
        <Heading>NOMO NOUNS</Heading>
      </HStack>

      {!isMobile && activeUserCount && (
        <HStack>
          {activeUserCount > 1 ? <HiUsers /> : <HiUser />}
          <Text>{activeUserCount}</Text>
          <Text>{`${
            activeUserCount > 1 ? " players" : " player"
          } connected`}</Text>
        </HStack>
      )}

      <HStack>
        {/* Network Switcher - refined styling to match ConnectKit button */}
        {!isMobile && (
          <Menu>
            <MenuButton 
              as={Button} 
              fontSize="xs"
              fontWeight="normal"
              px={4}
              py={2}
            >
              {chain?.name || "Select Network"}
            </MenuButton>
            <MenuList>
              {networks.map((network) => (
                <MenuItem 
                  key={network.chain.id}
                  onClick={() => switchNetwork?.(network.chain.id)}
                  fontWeight={chain?.id === network.chain.id ? "bold" : "normal"}
                >
                  {network.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
        
        {/* Wallet connect button */}
        {!isMobile && <ConnectKitButton label={"Connect to play"} />}
        
        {/* Sound toggle */}
        <Tooltip
          isOpen={showSoundTooltip}
          isDisabled={soundEnabled}
          hasArrow
          label={"Plays best with sound ON"}
        >
          <IconButton
            aria-label={"Toggle sound"}
            icon={
              soundEnabled ? (
                <MdMusicNote />
              ) : (
                <chakra.span animation={`${wobble} 1.5s infinite both`}>
                  <MdMusicOff />
                </chakra.span>
              )
            }
            onClick={() => toggleSound()}
            transition={"min-width 1s"}
          />
        </Tooltip>
        
        {/* Theme toggle */}
        <IconButton
          aria-label={"ColorMode"}
          onClick={toggleColorMode}
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
        />
      </HStack>
    </HStack>
  );
};

const wobble = keyframes`
  10% {
    transform: rotate(-10deg);
  }
  20% {
    transform: rotate(10deg);
  }
  30% {
    transform: rotate(-6deg);
  }
  40% {
    transform: rotate(4deg);
  }
  50% {
    transform: rotate(-2deg);
  }
`;