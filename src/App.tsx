import { Navbar } from './components/Navbar'
import { Hero } from './sections/Hero'
import { PetaKebun } from './sections/PetaKebun'
import { Contact } from './sections/Contact'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PetaKebun />
        <Contact />
      </main>
    </>
  )
}

export default App