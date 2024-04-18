import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { BaseGenerator } from "./components/BaseGenerator";
import { BaseSelector } from "./components/BaseSelector";
import { BaseDeselector } from "./components/BaseDeselector";

export const Base = () => {
  return (
    <>
        <h3>Muddle's Wilderness Location Generator</h3>
        <Header />
        <main>
          <BaseSelector />
          <BaseGenerator name='base' />
          <BaseDeselector />
        </main>
        <Footer />
    </>
  )
}
