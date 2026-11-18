import { Navbar } from './components/Navbar'
import { Hero } from './sections/Hero'
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

        {/* Placeholder — next section is built from the next reference */}
        <section id="jelajah" className="grid min-h-[60vh] place-items-center bg-cream-50 px-4">
          <p className="text-sm font-medium tracking-[0.2em] text-sage-600 uppercase">Section berikutnya · menunggu referensi</p>
        </section>
      </main>
    </>
  )
}

export default App
