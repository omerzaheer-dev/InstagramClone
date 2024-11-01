import MobileSidebar from "@/comps/MobileSidebar";
import MobileTopSidebar from "@/comps/MobileTopSidebar";
import Sidebar from "@/comps/Sidebar";
import { Outlet } from "react-router-dom";

const Main = () => {
    return (
        <div className="w-[100%] flex">
            <div className="w-[18%] hidden lg:block overflow-hidden">
                <Sidebar />
            </div>
            <main className="lg:w-[82%] w-[100%]">
                <MobileTopSidebar />
                <Outlet />
                <MobileSidebar />
            </main>
        </div>
    )
}

export default Main
