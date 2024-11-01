import instagramsvg from "../assets/instagram.svg"
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import useLogout from "@/hooks/useLogout";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    // const logout = useLogout()
    // const handleLogout = async () => {
    //     await logout();
    //     navigate('/')
    // }
    const sidebarHandler = async (itemText) => {
        if (itemText === "Home") { navigate('/home') }
        else if (itemText === "Search") { navigate("/search") }
        else if (itemText === "Explore") { navigate("/explore") }
        else if (itemText === "Messages") { navigate("/messages") }
        else if (itemText === "Notifications") { navigate("/notifications") }
        else if (itemText === "Create") { navigate("/create") }
        else if (itemText === "Profile") { navigate("/profile") }
        else {
            if (itemText === "Logout") {
                // await handleLogout();
            }
        }
    };
    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ]
    return (
        <div className=' max-h-[100vh] fixed border-r-[1px] h-[100vh] overflow-hidden px-5 py-7 text-slate-900'>
            <div className="flex items-center justify-center gap-3 mb-14">
                <img src={instagramsvg} className="w-8" alt="" />
                <h1 className="text-2xl tracking-widest text-slate-900">Instagram</h1>
            </div>
            <div className="relative">
                {
                    sidebarItems.map((item, index) => {
                        return (
                            <div key={index} onClick={async () => { await sidebarHandler(item.text) }} className="flex py-[12px] border-b border-b-slate-100 hover:border-b-0 last:border-b-0 cursor-pointer px-[10px] rounded-md hover:bg-gray-100 items-center justify-start gap-3 font-medium">
                                <div>{item.icon}</div>
                                <div className="text-xl">{item.text}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Sidebar
