import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { Contact } from './sections/Contact'
import { Hero } from './sections/Hero'
import { JenisFlora } from './sections/JenisFlora'
import { PetaKebun } from './sections/PetaKebun'
import { Tentang } from './sections/Tentang'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Tentang />
        <PetaKebun />
        <JenisFlora />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
