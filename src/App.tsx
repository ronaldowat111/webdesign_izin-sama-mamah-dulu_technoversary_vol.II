import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-lg font-semibold text-brand-dark">Kebun Raya Bogor</span>
          <div className="flex gap-6 text-sm text-slate-600">
            <a href="#" className="hover:text-brand">Home</a>
            <a href="#" className="hover:text-brand">About</a>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start justify-center gap-6 px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">React + Tailwind starter</h1>
        <p className="max-w-xl text-slate-600">
          Edit <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">src/App.tsx</code> to get started.
        </p>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="rounded-lg bg-brand px-5 py-2.5 font-medium text-white transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Clicked {count} times
        </button>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default App
