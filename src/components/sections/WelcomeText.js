import React, { useEffect, useState } from 'react'
import { Heading } from "@chakra-ui/react"

import { Auth } from '@aws-amplify/auth';

function WelcomeText() {
  const [username, setUsername] = useState("user");

	useEffect(() => {
		Auth.currentUserInfo().then((userInfo) => {
			setUsername(userInfo.username)
      console.log(userInfo)
		})
	}, [])

  return (
    <div>
      <Heading as="h2" size="2xl" textAlign="left" isTruncated mb={8} pl={8}>Welcome {username}</Heading>
    </div>
  )
}

export default WelcomeText
