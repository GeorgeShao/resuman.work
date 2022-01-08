import React from 'react'
import { Heading } from "@chakra-ui/react"

function WelcomeText(props){
  return (
    <div>
      <Heading as="h2" size="2xl" textAlign="left" isTruncated mb={8} pl={8}>Welcome {props.username}</Heading>
    </div>
  )
}

export default WelcomeText
