import './App.css'
import { Route, Switch } from "wouter";
import { Home } from "./pages/home/Home";
import { Base } from "./legacy/pages/base/Base";
import { Geomorph } from "./legacy/pages/geomorph/Geomorph";
import { Character } from "./legacy/pages/character/Character";
import { Page3 } from './legacy/configCharacterGen/pages/Page3';
import GeomorphWalkPage from './legacy/originalGeomorphs/geomorph-walk/Page';
import GeomorphDfsPage from './legacy/originalGeomorphs/geomorph-dfs/Page';
import GeomorphBspPage from './legacy/originalGeomorphs/geomorph-bsp/Page';
import GeomorphCaPage from './legacy/originalGeomorphs/geomorph-ca/Page';
import GeomorphPrimPage from './legacy/originalGeomorphs/geomorph-prim/Page';
import GeomorphWfcPage from './legacy/originalGeomorphs/geomorph-wfc/Page';
import RefactorGeomorphPage from './legacy/refactorGeomorphs/GeomorphPage';
import RefactorGeomorphWalkPage from './legacy/refactorGeomorphs/geomorph-walk/Page';
import RefactorGeomorphDfsPage from './legacy/refactorGeomorphs/geomorph-dfs/Page';
import RefactorGeomorphBspPage from './legacy/refactorGeomorphs/geomorph-bsp/Page';
import RefactorGeomorphCaPage from './legacy/refactorGeomorphs/geomorph-ca/Page';
import RefactorGeomorphPrimPage from './legacy/refactorGeomorphs/geomorph-prim/Page';
import RefactorGeomorphWfcPage from './legacy/refactorGeomorphs/geomorph-wfc/Page';
import GeomorphDungeonPage from './lab/geomorph-dungeon/Page';
import GeomorphDungeonV1Page from './legacy/snapshots/geomorph-dungeon-v1/Page';
import GeomorphDungeonV2Page from './legacy/snapshots/geomorph-dungeon-v2/Page';
import GeomorphDungeonV3Page from './legacy/snapshots/geomorph-dungeon-v3/Page';
import GeomorphDungeonV4Page from './legacy/snapshots/geomorph-dungeon-v4/Page';
import GeomorphDungeonV5Page from './legacy/snapshots/geomorph-dungeon-v5/Page';
import HexTerrainWfcPage from './legacy/hexTerrain/Page';
import RefactorHexTerrainWfcPage from './legacy/refactorHexTerrain/Page';
import HexTransitionsWfcPage from './lab/hex-transitions/Page';
import HexTransitionsV2Page from './lab/hex-transitions-2/Page';
import { Page4 } from './legacy/configDungeonGen/pages/Page4';
import { BaseRefactor } from './legacy/baseRefactor/pages/BaseRefactor';
import RoomDescriptionPage from './lab/room-description/Page';
import RoomDescriptionEditorPage from './lab/room-description/EditorPage';
import TileEdgeStudioPage from './lab/tile-edge-studio/Page';
import Caves1Page from './lab/caves-1/Page';


function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/base" component={Base} />
      <Route path="/lab/room-description" component={RoomDescriptionPage} />
      <Route path="/lab/room-description/edit" component={RoomDescriptionEditorPage} />
      <Route path="/lab/tile-edge-studio" component={TileEdgeStudioPage} />
      <Route path="/lab/caves/1" component={Caves1Page} />
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
      <Route path="/refactor/geomorph-dungeon-v1" component={GeomorphDungeonV1Page} />
      <Route path="/refactor/geomorph-dungeon-v2" component={GeomorphDungeonV2Page} />
      <Route path="/refactor/geomorph-dungeon-v3" component={GeomorphDungeonV3Page} />
      <Route path="/refactor/geomorph-dungeon-v4" component={GeomorphDungeonV4Page} />
      <Route path="/refactor/geomorph-dungeon-v5" component={GeomorphDungeonV5Page} />
      <Route path="/hex-terrain/wfc" component={HexTerrainWfcPage} />
      <Route path="/refactor/hex-terrain/wfc" component={RefactorHexTerrainWfcPage} />
      <Route path="/refactor/hex-transitions/wfc" component={HexTransitionsWfcPage} />
      <Route path="/refactor/hex-transitions/v2" component={HexTransitionsV2Page} />
      <Route path="/character" component={Character} />
      <Route path="/config-character" component={Page3} />
      <Route path="/config-dungeon" component={Page4} />
      <Route path="/baseRefactor" component={BaseRefactor} />
      <Route>404: No such page!</Route>
    </Switch>
  )
}

export default App
