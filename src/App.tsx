import { RecoilRoot } from "recoil";
import './App.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { test } from './legacy/tagBasedItemLists'
import { BaseGenerator } from "./components/BaseGenerator";
import { BaseSelector } from "./components/BaseSelector";
import { BaseDeselector } from "./components/BaseDeselector";

function App() {
  // test();

  return (
      <RecoilRoot>
        <h3>Muddle's Wilderness Location Generator</h3>
        <Header />
        <main>
          <BaseSelector />
          <BaseGenerator name='base' />
          <BaseDeselector />
        </main>
        <Footer />
      </RecoilRoot>
  )
}

export default App
