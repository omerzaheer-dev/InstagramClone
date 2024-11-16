import Posts from "@/comps/Posts"
import SuggestedUser from "@/comps/SuggestedUser"
// import { useSelector } from "react-redux"
const Home = () => {

    return (
        <div className='w-[100%] box-border flex lg:flex-row flex-col lg:gap-9 gap-5 lg:pl-9 lg:items-start items-center pt-5 lg:pt-9'>
            <div className='lg:max-w-[64%] box-border max-w-[90vw] w-full h-auto '>
                <Posts />
            </div>
            <div className='lg:max-w-[28%] box-border lg:fixed lg:right-0 max-w-[90vw] w-full lg:h-[88%]'><SuggestedUser /></div>
        </div>
    )
}

export default Home