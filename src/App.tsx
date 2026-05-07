import './App.css'
import { Route, Switch } from "wouter";
import { Base } from "./pages/base/Base";
import { Geomorph } from "./pages/geomorph/Geomorph";
import { Character } from "./pages/character/Character";
// import { Page } from "./refactor/pages/Page";
// import { Page2 } from './refactor2/pages/Page2';
import { Page3 } from './refactor3/pages/Page3';
import GeomorphWalkPage from './geomorph-walk/Page';
import { Page4 } from './refactor4/pages/Page4';
import { BaseRefactor } from './baseRefactor/pages/BaseRefactor';


function App() {
  return (
    <Switch>
      <Route path="/" component={Base} />
      <Route path="/geomorph" component={Geomorph} />
      <Route path="/geomorph-walk" component={GeomorphWalkPage} />
      <Route path="/character" component={Character} />
      <Route path="/refactor3" component={Page3} />
      <Route path="/refactor4" component={Page4} />
      <Route path="/baseRefactor" component={BaseRefactor} />
      <Route>404: No such page!</Route>
    </Switch>
  )
}

export default App
