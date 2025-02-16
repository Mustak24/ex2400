import { Link } from "react-router-dom";
import Button from "../Components/Button";

export default function Home({}){
    return <>
        <div className="w-screen h-screen text-4xl sm:p-10 p-5">
            <div className="bg-blue-400 w-fit px-5 rounded-full py-2 text-white">
                Home
            </div>
            <div className="mt-14 w-full flex flex-col items-start gap-10 text-lg">
                <Button className="py-2 px-10 ">
                    <Link to={'/games/xox'} className="font-semibold">XOX Game</Link>
                </Button>
                <Button className="py-2 px-10 ">
                    <Link to={'/games/number-box'} className="font-semibold">Number Box Game</Link>
                </Button>
            </div>
        </div>
    </>
}