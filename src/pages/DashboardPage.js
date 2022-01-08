import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import '../App.css';
import Logo from "../components/ui/Logo"
import { Box, Flex, Text, Button } from "@chakra-ui/react"
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons"
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from '@aws-amplify/auth';
import  DashboardLayout from '../components/layouts/DashboardLayout'

const MenuItems = (props) => {
  const { children, isLast, to = "/", ...rest } = props
  return (
    <Text
      mb={{ base: isLast ? 0 : 8, sm: 0 }}
      mr={{ base: 0, sm: isLast ? 0 : 8 }}
      display="block"       
      {...rest}
    >
      <Link to={to}>{children}</Link>
    </Text>
  )
}

const DashboardPage = (props) => {
	const [userInfo, setUserInfo] = useState(null);

	useEffect(() => {
		Auth.currentUserInfo().then((userInfo) => {
			setUserInfo(userInfo)
		})
	}, [])
	
	const [show, setShow] = React.useState(false)
  const toggleMenu = () => setShow(!show)

  const signOut = () => {
    Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));
  }

  return (
		<DashboardLayout />
  )
}

export default withAuthenticator(DashboardPage);