import React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import Landing from "./pages/Landing"

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
