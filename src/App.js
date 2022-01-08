import React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import LandingPage from "./pages/LandingPage"

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
