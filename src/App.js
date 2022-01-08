import React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import CreateAccountPage from "./pages/CreateAccountPage"

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/signup">
          <CreateAccountPage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
