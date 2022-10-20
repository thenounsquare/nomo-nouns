import { extendTheme } from "@chakra-ui/react";
import { Theme } from "@chakra-ui/theme";

export const theme = extendTheme({
  fonts: {
    heading: `'Londrina Solid', sans-serif`,
    body: `'Londrina Solid', sans-serif`,
  },
  fontSizes: {
    xs: "16px",
    sm: "20px",
    md: "24px",
    lg: "28px",
    xl: "32px",
  },
}) as Theme;
