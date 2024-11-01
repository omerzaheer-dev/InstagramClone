import { LogOut, MessageCircle, TrendingUp } from 'lucide-react'
import instagramsvg from "../assets/instagram.svg"
// import useLogout from "@/hooks/useLogout";
import { useNavigate } from "react-router-dom";

const MobileTopSidebar = () => {
    const navigate = useNavigate();
    // const logout = useLogout()
    // const handleLogout = async () => {
    //     await logout();
    //     navigate('/')
    // }
    const sidebarHandler = async (itemText) => {
        if (itemText === "Explore") { navigate("/explore") }
        else if (itemText === "Messages") { navigate("/messages") }
        else {
            if (itemText === "Logout") {
                // await handleLogout();
            }
        }
    };
    const sidebarItems = [
        { icon: <TrendingUp className='md:text-2xl' />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        // { icon: <LogOut />, text: "Logout" },
    ]
    return (
        <div className='w-[100vw] lg:hidden md:px-6 px-3 py-1 md:py-2 border-b-[2px] lg:w-0 lg:static fixed top-0 flex items-center justify-between bg-white z-50'>
            <div className="flex items-center justify-center gap-3 md:gap-4">
                <img src={instagramsvg} className="w-7 md:w-9 md:h-9 h-7" alt="" />
                <h1 className="text-2xl md:text-3xl tracking-widest text-slate-900">Instagram</h1>
            </div>
            <div className="flex items-center justify-center gap-1 md:gap-4">
                {
                    sidebarItems.map((item, index) => {
                        return (
                            <div key={index} onClick={async () => { await sidebarHandler(item.text) }} className="flex py-[12px] border-b border-b-slate-100 hover:border-b-0 last:border-b-0 cursor-pointer px-[10px] rounded-md hover:bg-gray-100 items-center justify-start gap-3 font-medium">
                                <div>{item.icon}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default MobileTopSidebar

