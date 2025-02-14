import { useEffect, useState } from "react"
import Button from "../../Components/Button";

export default function Xox({}){

    const query = new URLSearchParams(window.location.search)
    const bordSize = query.get('row') || query.get('col') || 3;
    const bordArr = Array.from({length: bordSize}, _ => Array.from({length: bordSize}, _ => ''));
    
    const [whosePlay, setWhosePlay] = useState('X');

    const [roundStake, setRoundStake] = useState([]);

    const [bord, setBord] = useState(bordArr);
    const [winPlayerInfo, setWinPlayerInfo] = useState([false])



    function resetGame(){
        setWhosePlay('X');
        setRoundStake([]);
        setWinPlayerInfo([false])
        setBord(bordArr);
    }


    function isAnyWin(){
        let verArr = [[-bord.length, -bord.length],[-bord.length, -bord.length]]
        
        for(let i=0; i<bord.length; i++){
            let rcArr = [[-bord.length, -bord.length],[-bord.length, -bord.length]]

            for(let j=0; j<bord.length; j++){
                if(bord[j][i] != '') rcArr[1][bord[j][i] == 'X' ? 0 : 1] += 1;
                if(bord[i][j] == '') continue;

                rcArr[0][bord[i][j] == 'X' ? 0 : 1] += 1;
                if(i - j == 0) verArr[0][bord[i][j] == 'X' ? 0 : 1] += 1;
                if(i + j == bord.length-1) verArr[1][bord[i][j] == 'X' ? 0 : 1] += 1;
            }

            if(rcArr[0][0]*rcArr[0][1] == 0) return [true , bord[i][0], `r${i}`];
            if(rcArr[1][0]*rcArr[1][1] == 0) return [true , bord[0][i], `c${i}`];
            
        }
    
        if(verArr[0][0]*verArr[0][1] == 0) return [true, bord[0][0], 'vd']
        if(verArr[1][0]*verArr[1][1] == 0) return [true, bord[0].at(-1), 'vu']

        return [false, ''];
    }


    function handleGameOnClick(e){
        let {dataset} = e.target;
        if(!dataset.index || winPlayerInfo[0]) return;
        if(roundStake.length < 2*bordSize && roundStake.search(dataset.index)) return;

        let newRoundStake = roundStake;
        if(newRoundStake.length == 2*bordSize) newRoundStake.shift();
        newRoundStake.push(dataset.index);

        setRoundStake(newRoundStake);

        setBord((bord) => {
            let {index} = dataset
            bord[parseInt(index/bordSize)][index%bordSize] = whosePlay;

            for(let i=0; i<bordSize; i++){
                for(let j=0; j<bordSize; j++){
                    if(!newRoundStake.search(i*bordSize + j)) bord[i][j] = ''
                }
            }

            return bord;
        });  

        setWhosePlay((old) => old == 'X' ? 'O' : 'X');
        
    }

    Array.prototype.search = function(key){
        for(let i=0; i<this.length; i++)
            if(this[i] == key) return true;
        return false
    }

    useEffect(() => {
        let result = isAnyWin();
        if(result[0]) setWinPlayerInfo(result);
    }, [whosePlay])

    return <>
        <main className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center px-5 sm:px-10">
            {
                winPlayerInfo[0] ? (
                    <div className="text-3xl text-center">Player {winPlayerInfo[1]} is Win</div>
                ) : (
                    <div className="text-3xl text-center">{whosePlay} Player chance</div>
                )}
            <div onClick={handleGameOnClick} className="grid gap-1 sm:gap-2 aspect-square w-full max-w-[400px] bg-zinc-600 rounded-lg justify-center items-center sm:p-3 p-2 mt-5"
                style={{
                    gridTemplateColumns: `repeat(${bordSize}, minmax(0, 1fr))`
                }}    
            >
                {bord.flat(1).map((e, i) => {
                    return <div key={i} data-index={i} className="bg-white rounded-md text-black flex items-center justify-center text-6xl font-semibold w-full aspect-square">
                        {e}
                    </div>
                })}
            </div>
            <div className="mt-5 ">
                <Button onClick={resetGame} text='royalblue'>Restart</Button>
            </div>
        </main>
    </>
}