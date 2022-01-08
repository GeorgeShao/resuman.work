import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  colors: {
    brand: {
      main: "#65c2f0",
      light: "#94d4f4",
      dark: "#39afea",
    },
  },
})

export default theme;