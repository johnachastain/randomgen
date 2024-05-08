import './App.css'
import { Route, Switch } from "wouter";
import { Base } from "./pages/base/Base";
import { Geomorph } from "./pages/geomorph/Geomorph";
import { Character } from "./pages/character/Character";

function App() {
  return (
    <Switch>
      <Route path="/" component={Base} />
      <Route path="/geomorph" component={Geomorph} />
      <Route path="/character" component={Character} />
      <Route>404: No such page!</Route>
    </Switch>
  )
}

export default App
