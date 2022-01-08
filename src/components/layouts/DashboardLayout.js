import React from "react"
import { Flex } from "@chakra-ui/react"
import DashboardHeader from "../sections/DashboardHeader"
import WelcomeText from "../sections/WelcomeText"

export default function DashboardLayout(props) {
  return (
    <Flex
      direction="column"
      align="left"
      maxW={{ xl: "1200px" }}
      m="0 auto"
      {...props}
    >
      <DashboardHeader />
      <WelcomeText />
      {props.children}
    </Flex>
  )
}
