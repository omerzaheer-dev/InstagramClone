import Posts from "@/comps/Posts"
import { useSelector } from "react-redux"
const Home = () => {
    const user = useSelector((state) => state.auth.user);

    return (
        <div className='w-[100%] flex lg:flex-row flex-col lg:gap-9 gap-5 lg:pl-9 lg:items-start items-center pt-5 lg:pt-9'>
            <div className='lg:max-w-[65%] max-w-[90vw] w-full h-auto '>
                <Posts />
                <button onClick={() => { console.log(user); }}>iuagi</button>
            </div>
            <div className='lg:max-w-[35%] max-w-[90vw] bg-slate-700 w-full h-auto'>h</div>
        </div>
    )
}

export default Home