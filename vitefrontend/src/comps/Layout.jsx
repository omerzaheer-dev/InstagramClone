
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
const Layout = () => {
  return (
    <main>
      <Outlet />
      {/* <Toaster /> */}
    </main>
  )
}

export default Layout
