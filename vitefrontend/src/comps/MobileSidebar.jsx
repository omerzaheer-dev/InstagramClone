import { Heart, Home, PlusSquare, Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import useLogout from "@/hooks/useLogout";
import { useNavigate } from "react-router-dom";
import useAuth from '@/hooks/useAuth';
import DialogOpenClose from "./DialogOpenClose";
import { CreatePost } from './CreatePost';
const MobileSidebar = () => {
  const { open, setOpen } = DialogOpenClose();
  const { auth } = useAuth()
  const navigate = useNavigate();
  const sidebarHandler = async (itemText) => {
    if (itemText === "Home") { navigate('/') }
    else if (itemText === "Search") { navigate("/search") }
    else if (itemText === "Create") { setOpen(true); }
    else if (itemText === "Notifications") { navigate("/notifications") }
    else if (itemText === "Create") { auth._id ? setOpen(true) : navigate("/login"); }
    else {
      if (itemText === "Profile") {
        auth._id ? navigate(`/profile/${auth?._id}`) : navigate("/login")
      }
    }
  };
  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: <Heart />, text: "Notifications" },
    {
      icon: (
        <Avatar className='w-6 h-6'>
          <AvatarImage src={auth._id ? auth?.profilePicture : "https://github.com/shadcn.png"} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile"
    },
  ]
  return (
    <div>
      <div className='w-[100vw] lg:hidden md:px-6 px-2 py-[1px] border-t-[2px] lg:w-0 lg:static fixed bottom-0 flex items-center justify-between bg-white z-50'>
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
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  )
}

export default MobileSidebar
