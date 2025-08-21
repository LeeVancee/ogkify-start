import { createFileRoute, Outlet } from '@tanstack/react-router'
import Footer from '@/components/shop/home/footer'
import Header from '@/components/shop/home/header'

export const Route = createFileRoute('/_shop')({
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
