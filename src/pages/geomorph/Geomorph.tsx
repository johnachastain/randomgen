import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { GeomorphGenerator } from "./GeomorphGenerator";
import { GeomorphNav } from "../../originalGeomorphs/geomorph-shared/GeomorphNav";


export const Geomorph = () => {
  return (
    <>
        {/* <h3>Muddle's Map Generator</h3> */}
        {/* <Header /> */}
        <main>
          <div style={{ padding: 16 }}>
            <GeomorphNav />
          </div>
          <GeomorphGenerator name='map' />
        </main>
        {/* <Footer /> */}
    </>
  )
}
