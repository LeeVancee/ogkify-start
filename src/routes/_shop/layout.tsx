import Footer from '@/components/shop/layout/footer'
import Header from '@/components/shop/layout/header'
import {  Outlet } from '@tanstack/react-router'

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className=" min-h-screen flex flex-col">
      <Header />
      <main className="flex-1  container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
