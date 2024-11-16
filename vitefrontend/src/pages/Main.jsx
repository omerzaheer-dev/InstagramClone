import MobileSidebar from "@/comps/MobileSidebar";
import MobileTopSidebar from "@/comps/MobileTopSidebar";
import Sidebar from "@/comps/Sidebar";
import { Outlet } from "react-router-dom";
import "../index.css"
const Main = () => {
    return (
        <div className="w-[100%] flex">
            <div className="w-[18%] hidden lg:block overflow-hidden">
                <Sidebar />
            </div>
            <main className="lg:w-[82%] w-[100%] example">
                <div className="mt-12 lg:mt-0">
                    <MobileTopSidebar />
                </div>
                <Outlet />
                <div className="mt-16 lg:mt-0">
                    <MobileSidebar />
                </div>
            </main>
        </div>
    )
}

export default Main
