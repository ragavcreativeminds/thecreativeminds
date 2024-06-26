import { extendTheme } from "@chakra-ui/react";
// import { Button } from "./button";
// import { Input } from "./input";
import "@fontsource/open-sans/300.css"
import { Button } from "./button";

export const theme = extendTheme({
  colors: {
    brand: {
      100: "#FF3C00",
    },
  },
  fonts: {
    body: "Open Sans, sans-serif",
  },
  styles: {
    global: () => ({
      body: {
        bg: "gray.200",
      },
    }),
  },
  components: {
    Button,
    // Input, // not working for some reason - come back to this
  },
});