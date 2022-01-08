import React, { useEffect, useState } from 'react'
import { Flex } from "@chakra-ui/react"
import DashboardHeader from "../sections/DashboardHeader"
import WelcomeText from "../sections/WelcomeText"
import MainList from "../sections/MainList"

import { Auth } from '@aws-amplify/auth';

export default function DashboardLayout(props) {
  const [username, setUsername] = useState("");

	useEffect(() => {
		Auth.currentUserInfo().then((userInfo) => {
			setUsername(userInfo.username)
      console.log(userInfo)
		})
	}, [])

  return (
    <Flex
      direction="column"
      align="left"
      maxW={{ xl: "1200px" }}
      m="0 auto"
      {...props}
    >
      <DashboardHeader />
      <WelcomeText username={username} />
      <MainList username={username} />
      {props.children}
    </Flex>
  )
}
