import { useEffect, useState } from "react";
import Button from "../../Components/Button";

export default function NumberBox({}){

    const [bordSize, setBordSize] = useState(4);

    const [rowSum, setRowSum] = useState([]);
    const [colSum, setColSum] = useState([]);
    const [isWin, setIsWin] = useState(false);

    function reset(){
        let inputs = document.querySelectorAll('input[type="checkbox"]');
        inputs.forEach(e => e.checked = false);
        setIsWin(false);
        start();
    }

    function handleGameOnClick(e){
        if(isWin) return;

        let {row, col} = e.target.dataset;
        if(!(row && col)) return;

        let {checked} = e.target.firstElementChild
        
        setRowSum(rowSum => {
            let temp = [...rowSum]
            temp[row] += checked ? 1 : -1;
            return temp
        })

        setColSum(colSum => {
            let temp = [...colSum]
            temp[col] += checked ? 1 : -1;
            return [...temp]
        })
    }


    function start(){
        let row = [], col = [];
        for(let i=0; i<bordSize; i++){
            row.push(0);
            col.push(0);
        }
        
        for(let i=0; i<bordSize; i++){
            for(let j=0; j<bordSize; j++){
                let binary = Math.round(Math.random());
                console.log(row[i], col[j])
                row[i] += binary;
                col[j] += binary;
            }
        }
        
        setRowSum([...row])
        setColSum([...col])
    }


    useEffect(() => {
        start()
    }, [bordSize])    

    useEffect(() => {
        if(!(rowSum.length && colSum.length)) return;
        let sum = rowSum.reduce((a,b) => a|b) | colSum.reduce((a, b) => a|b);
        if(sum == 0) setIsWin(true);
    }, [rowSum, colSum])

    return <>
        <main className="w-screen h-screen bg-zinc-200 text-white flex flex-col items-center justify-center gap-5 overflow-hidden p-5 sm:p-10">
            <div 
                onClick={handleGameOnClick}
                className="relative w-full max-w-[400px] aspect-square bg-zinc-400 rounded-2xl flex flex-col items-center justify-around gap-2 p-2"
            >
                <div className="flex items-center justify-around w-full h-full gap-2">
                    <div className="flex-1 invisible"></div>
                    {colSum.map((e, i) => {
                        return (
                            <div    
                                key={'col'+i} 
                                className="flex-1 rounded-md bg-black text-white flex items-center justify-center text-sm sm:text-2xl font-semibold aspect-square overflow-hidden"
                            >{e}</div>
                        )
                    })}
                </div>

                {rowSum.map((e, i) => {
                    return (
                        <div 
                            key={'row'+i}
                            className="flex items-center justify-around w-full h-full gap-2"
                        >
                            <div className="flex-1 rounded-md bg-black text-white flex items-center justify-center text-sm sm:text-2xl sm:font-semibold aspect-square overflow-hidden">{e}</div> 

                            {Array.from({length: bordSize}).map((_, j) => {
                                return (
                                    <label key={i+''+j} data-row={i} data-col={j} htmlFor={i+''+j} className="flex-1 rounded-md flex items-center justify-center h-full has-[input:checked]:bg-red-500 bg-white text-white transition-all duration-300">
                                        <input id={i+''+j} type="checkbox" hidden disabled={isWin} />   
                                        {isWin ? 'W' : ''} 
                                    </label>
                                )
                            })} 
                        </div>
                    )
                })}
            </div>
            
            <div>
                {[4,5,6,7,8,9,10].map(e => {
                    return <button key={e} className="bg-white text-black m-1 size-6 sm:size-10 rounded-lg font-semibold text-sm sm:text-lg sm:hover:opacity-100 active:opacity-100"
                    style={{
                        opacity: bordSize == e ? '1' : '.5'
                    }}
                    onClick={() => setBordSize(e)}
                >{e}</button>
                })}
            </div>
            <Button onClick={() => reset()}>Restart</Button>
        </main> 
    </>
}