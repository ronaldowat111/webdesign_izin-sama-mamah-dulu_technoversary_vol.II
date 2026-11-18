import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { Hero } from './sections/Hero'
import { JenisFlora } from './sections/JenisFlora'
import { Kontak } from './sections/Kontak'
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
        <Kontak />
      </main>
      <Footer />
    </>
  )
}

export default App
