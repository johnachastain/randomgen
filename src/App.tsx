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
import RefactorGeomorphPage from './refactorGeomorphs/GeomorphPage';
import RefactorGeomorphWalkPage from './refactorGeomorphs/geomorph-walk/Page';
import RefactorGeomorphDfsPage from './refactorGeomorphs/geomorph-dfs/Page';
import RefactorGeomorphBspPage from './refactorGeomorphs/geomorph-bsp/Page';
import RefactorGeomorphCaPage from './refactorGeomorphs/geomorph-ca/Page';
import RefactorGeomorphPrimPage from './refactorGeomorphs/geomorph-prim/Page';
import RefactorGeomorphWfcPage from './refactorGeomorphs/geomorph-wfc/Page';
import GeomorphDungeonPage from './refactorGeomorphs/geomorph-dungeon/Page';
import HexTerrainWfcPage from './hexTerrain/Page';
import RefactorHexTerrainWfcPage from './refactorHexTerrain/Page';
import HexTransitionsWfcPage from './refactorHexTransitions/Page';
import HexTransitionsV2Page from './refactorHexTransitions2/Page';
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
      <Route path="/refactor/geomorph" component={RefactorGeomorphPage} />
      <Route path="/refactor/geomorph-walk" component={RefactorGeomorphWalkPage} />
      <Route path="/refactor/geomorph-dfs" component={RefactorGeomorphDfsPage} />
      <Route path="/refactor/geomorph-bsp" component={RefactorGeomorphBspPage} />
      <Route path="/refactor/geomorph-ca" component={RefactorGeomorphCaPage} />
      <Route path="/refactor/geomorph-prim" component={RefactorGeomorphPrimPage} />
      <Route path="/refactor/geomorph-wfc" component={RefactorGeomorphWfcPage} />
      <Route path="/refactor/geomorph-dungeon" component={GeomorphDungeonPage} />
      <Route path="/hex-terrain/wfc" component={HexTerrainWfcPage} />
      <Route path="/refactor/hex-terrain/wfc" component={RefactorHexTerrainWfcPage} />
      <Route path="/refactor/hex-transitions/wfc" component={HexTransitionsWfcPage} />
      <Route path="/refactor/hex-transitions/v2" component={HexTransitionsV2Page} />
      <Route path="/character" component={Character} />
      <Route path="/refactor3" component={Page3} />
      <Route path="/refactor4" component={Page4} />
      <Route path="/baseRefactor" component={BaseRefactor} />
      <Route>404: No such page!</Route>
    </Switch>
  )
}

export default App
