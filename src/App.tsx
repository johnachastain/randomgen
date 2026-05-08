import './App.css'
import { Route, Switch } from "wouter";
import { Base } from "./pages/base/Base";
import { Geomorph } from "./pages/geomorph/Geomorph";
import { Character } from "./pages/character/Character";
// import { Page } from "./refactor/pages/Page";
// import { Page2 } from './refactor2/pages/Page2';
import { Page3 } from './refactor3/pages/Page3';
import GeomorphWalkPage from './originalGeomorphs/geomorph-walk/Page';
import GeomorphDfsPage from './originalGeomorphs/geomorph-dfs/Page';
import GeomorphBspPage from './originalGeomorphs/geomorph-bsp/Page';
import GeomorphCaPage from './originalGeomorphs/geomorph-ca/Page';
import GeomorphPrimPage from './originalGeomorphs/geomorph-prim/Page';
import GeomorphWfcPage from './originalGeomorphs/geomorph-wfc/Page';
import { Page4 } from './refactor4/pages/Page4';
import { BaseRefactor } from './baseRefactor/pages/BaseRefactor';


function App() {
  return (
    <Switch>
      <Route path="/" component={Base} />
      <Route path="/geomorph" component={Geomorph} />
      <Route path="/geomorph-walk" component={GeomorphWalkPage} />
      <Route path="/geomorph-dfs" component={GeomorphDfsPage} />
      <Route path="/geomorph-bsp" component={GeomorphBspPage} />
      <Route path="/geomorph-ca" component={GeomorphCaPage} />
      <Route path="/geomorph-prim" component={GeomorphPrimPage} />
      <Route path="/geomorph-wfc" component={GeomorphWfcPage} />
      <Route path="/character" component={Character} />
      <Route path="/refactor3" component={Page3} />
      <Route path="/refactor4" component={Page4} />
      <Route path="/baseRefactor" component={BaseRefactor} />
      <Route>404: No such page!</Route>
    </Switch>
  )
}

export default App
