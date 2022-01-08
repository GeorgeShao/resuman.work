import React from "react"
import { Flex } from "@chakra-ui/react"
import DashboardHeader from "../sections/DashboardHeader"

export default function DashboardLayout(props) {
  return (
    <Flex
      direction="column"
      align="center"
      maxW={{ xl: "1200px" }}
      m="0 auto"
      {...props}
    >
      <DashboardHeader />
      {props.children}
    </Flex>
  )
}
