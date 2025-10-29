import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="min-h-dvh w-screen flex items-center justify-center flex-col gap-y-4 p-4">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <p className="text-lg text-gray-500">This is a test of the migration from Next.js to TanStack Start</p>
    </main>
  )
}