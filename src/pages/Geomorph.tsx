import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { GeomorphGenerator } from "./components/GeomorphGenerator";


export const Geomorph = () => {
  return (
    <>
        {/* <h3>Muddle's Map Generator</h3> */}
        {/* <Header /> */}
        <main>
          <GeomorphGenerator name='map' />
        </main>
        {/* <Footer /> */}
    </>
  )
}
