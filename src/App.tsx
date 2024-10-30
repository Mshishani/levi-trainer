
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
import useSound from 'use-sound'
import leviMeleeSound from './sounds/leviMeleeSound.mp3'
import leviMageSound from './sounds/leviMageSound.mp3'
import leviRangeSound from './sounds/leviRangeSound.mp3'

function App() {
    const [tick, setTick] = useState(0)
    const [actionQueue, setActionQueue] = useState<(()=> void)[]>([])

    const [magePrayer, setMagePrayer] = useState<boolean>(false)
    const [meleePrayer, setMeleePrayer] = useState<boolean>(false)
    const [rangePrayer, setRangePrayer] = useState<boolean>(false)

    const overHeadPrayerMap = new Map([
        [overHeadMage, "Mage prayer"],
        [overHeadRange, "range prayer"],
        [overHeadMelee, "Melee prayer"],
        [undefined, "No prayer"]
    ])



    const leviAttacks = [leviMage, leviRange, leviMelee];
    const [leviCurrentAttack, setLeviCurrentAttack] = useState<string>()
    const [leviPreviousAttack, setLeviPreviousAttack] = useState<string>()

    const [playMageSound] = useSound(leviMageSound)
    const [playRangeSound] = useSound(leviRangeSound)
    const [playMeleeSound] = useSound(leviMeleeSound)
    const leviSounds = [playMageSound, playRangeSound, playMeleeSound]

    const [prayerPercentage, setPrayerPercentage] = useState<number>(100)
    const [numberOfMistakes, setNumberOfMistakes] = useState<number>(0)
    const [totalAttacks, setTotalAttacks] = useState<number>(0)


    const determineOverhead = () => {
        if(magePrayer) return overHeadMage
        if(rangePrayer) return overHeadRange
        if(meleePrayer) return overHeadMelee
    }

    const calculatePrayerPercentage = () => {
        if (leviCurrentAttack === leviMage) {
            if (!magePrayer) console.log("incorrect prayer")
            else console.log("correct prayer")
        } else if (leviCurrentAttack === leviRange) {
            if (!rangePrayer) console.log("incorrect prayer")
            else console.log("correct prayer")
        } else if (leviCurrentAttack === leviMelee) {
            if (!meleePrayer) console.log("incorrect prayer")
            else console.log("correct prayer")
        }
        setPrayerPercentage(()=> (tick - numberOfMistakes) / tick)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTick((prevTick) => prevTick + 1);
        }, 600);

        return () => clearInterval(interval);
    }, []);

    const leviAttackMap = new Map([
        [leviMage, overHeadMage],
        [leviRange, overHeadRange],
        [leviMelee, overHeadMelee],
        [undefined, "No attack"]
    ])

    const leviAttackStartingTick  = 3;
    useEffect(() => {
        if (tick > leviAttackStartingTick) {
            setLeviPreviousAttack(()=> leviCurrentAttack)
            const rand = Math.floor(Math.random()*3)
            setLeviCurrentAttack(()=> leviAttacks[rand]);
            setTotalAttacks((prev) => ++prev)
            leviSounds[rand]()

            if (tick > leviAttackStartingTick + 2){
                if (leviAttackMap.get(leviPreviousAttack) !== determineOverhead()) setNumberOfMistakes((prev)=> ++prev)
            }
        }
        if (actionQueue.length > 0) {
            actionQueue.forEach((action) => action());
            setActionQueue([]);
        }

        setPrayerPercentage(()=> (((totalAttacks - numberOfMistakes) / totalAttacks) * 100))
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
                <div className={"levi-attacks"} style={{backgroundImage: `url(${leviCurrentAttack})`}}/>
                <div className={"tick-count"}>
                    <p>Attacks: {totalAttacks}</p>
                    <p>Mistakes: {numberOfMistakes}</p>
                    <p>Success Rate: {prayerPercentage.toFixed(2)}</p>
                </div>
            </div>
        </>
    );


}

export default App;
