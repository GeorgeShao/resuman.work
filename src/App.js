import React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import DashboardPage from "./pages/DashboardPage"

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/dashboard">
          <DashboardPage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
