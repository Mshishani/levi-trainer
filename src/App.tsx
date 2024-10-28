
import './App.css';
import {useEffect, useState} from "react";
import startOfFight from './images/startOfFight.png'
import prayerBookAllOffSmall from './images/prayerBookAllOffSmall2.png'
import overHeadMage from './images/overHeadMage.png'
import overHeadRange from './images/overHeadRange.png'
import overHeadMelee from './images/overHeadMelee.png'
import leviMage from './images/leviMage.png'
import leviMelee from './images/leviMelee.png'
import leviRange from './images/leviRange.png'

function App() {
    const [tick, setTick] = useState(0)
    const [actionQueue, setActionQueue] = useState<(()=> void)[]>([])

    const [magePrayer, setMagePrayer] = useState<boolean>(false)
    const [meleePrayer, setMeleePrayer] = useState<boolean>(false)
    const [rangePrayer, setRangePrayer] = useState<boolean>(false)

    const leviAttacks = [leviMage, leviRange, leviMelee];
    const [leviCurrentAttack, setLeviCurrentAttack] = useState<string>()
    const [index, setIndex] = useState(0);

    const determineOverhead = () => {
        if(magePrayer) return overHeadMage;
        if(rangePrayer) return overHeadRange;
        if(meleePrayer) return overHeadMelee;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTick((prevTick) => prevTick + 1);
            setLeviCurrentAttack(()=> leviAttacks[Math.floor(Math.random()*3)]);
        }, 600);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (actionQueue.length > 0) {
            actionQueue.forEach((action) => action());
            setActionQueue([]);
        }
    }, [tick]);


    const toggleMeleePrayer = () => {
        setActionQueue((prevQueue) => [
            ...prevQueue,
            ()=> setMeleePrayer((prev) => !prev),
            ()=> setRangePrayer(false),
            ()=> setMagePrayer(false),
        ])
    }

    const toggleRangePrayer = () => {
        setActionQueue((prevQueue) => [
            ...prevQueue,
            ()=> setRangePrayer((prev) => !prev),
            ()=> setMeleePrayer(false),
            ()=> setMagePrayer(false),
        ])
    }

    const toggleMagePrayer = () => {
        setActionQueue((prevQueue) => [
            ...prevQueue,
            ()=> setMagePrayer((prev) => !prev),
            ()=> setMeleePrayer(false),
            ()=> setRangePrayer(false),
        ])
    }

    return (
        <>
            <div className="app" style={{backgroundImage: `url(${startOfFight})`}}>
                <div className={"melee-prayer-button " + (meleePrayer ? 'prayer-activated-circle' : '')}
                     onClick={toggleMeleePrayer}></div>
                <div className={"mage-prayer-button " + (magePrayer ? 'prayer-activated-circle' : '')}
                     onClick={toggleMagePrayer}></div>
                <div className={"range-prayer-button " + (rangePrayer ? 'prayer-activated-circle' : '')}
                     onClick={toggleRangePrayer}></div>
                <div className={"overhead-box"} style={{backgroundImage: `url(${determineOverhead()})`}}/>
                <div className={"prayer-box"} style={{backgroundImage: `url(${prayerBookAllOffSmall})`}}></div>
                <div className={"tick-count"}>Tick Count: {tick}</div>
                <div className={"levi-attacks"} style={{backgroundImage: `url(${leviCurrentAttack})`}}/>
            </div>
        </>
    );


}

export default App;
