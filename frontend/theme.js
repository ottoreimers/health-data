"use client";
import { extendTheme } from "@chakra-ui/react";

// Config for dark mode
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// Create a theme with dark mode styling
const theme = extendTheme({
  config,
  // You can add specific component styles for dark mode here
  components: {
    // Example of customizing the Card component
    Card: {
      baseStyle: {
        container: {
          bg: "gray.700",
          color: "white",
        },
      },
    },

    // More component customizations can be added
  },
  // Override global styles
  styles: {
    global: {
      body: {
        bg: "gray.800",
        color: "white",
      },
    },
  },
});

export default theme;
