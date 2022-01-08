import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import '../App.css';
import Logo from "../components/ui/Logo"
import { Box, Flex, Text, Button } from "@chakra-ui/react"
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons"
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from '@aws-amplify/auth';
import  DashboardLayout from '../components/layouts/DashboardLayout'

const DashboardPage = (props) => {
	const [userInfo, setUserInfo] = useState(undefined);

	useEffect(() => {
		Auth.currentUserInfo().then((userInfo) => {
			setUserInfo(userInfo)
		})
	}, [])

  return (
		<DashboardLayout />
  )
}

export default withAuthenticator(DashboardPage);