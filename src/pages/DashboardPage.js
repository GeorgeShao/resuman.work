import React from 'react'
import '../App.css';
import  DashboardLayout from '../components/layouts/DashboardLayout'

import { withAuthenticator } from '@aws-amplify/ui-react'

const DashboardPage = (props) => {
  return (
		<DashboardLayout />
  )
}

export default withAuthenticator(DashboardPage);