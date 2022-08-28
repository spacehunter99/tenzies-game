import React from "react"
import Die from "./components/Die";
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {

  const [dices, setDices] = React.useState(allNewDice())

  const [tenzies, setTenzies] = React.useState(false)

  React.useEffect(() => {
    const winConditions = dices.filter(dice => {
      return dice.isHeld === true 
    })

    const firstValueOfDie = dices[0].value
    const allSameValues = dices.every(dice => {
      return dice.value === firstValueOfDie
    })

    if(winConditions.length === dices.length && allSameValues) {
      setTenzies(prevState => !prevState)
    }
  }, [dices])

  function generateNewDie() {
    return {
      value: Math.round(1 - 0.5 + Math.random() * (6 - 1 + 1)), 
      isHeld: false, 
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    setDices(prevState => {
      return prevState.map(die => {
        return die.isHeld === true 
        ? die
        : generateNewDie()
      })
    })

    if(dices.every(dice => dice.isHeld === true) && tenzies) {
      setTenzies(prevState => !prevState)
      setDices(allNewDice())
    }
  }

  function holdDice(id) {
    setDices(prevState => {
      return prevState.map(dice => {
        return dice.id === id ? {...dice, isHeld: !dice.isHeld} : dice
      })
    })
  }

  const allDices = dices.map(dice => {
    return <Die
     key={dice.id} 
     value={dice.value} 
     isHeld={dice.isHeld}
     holdDice={() => holdDice(dice.id)}
    />
  })

  const optionsOfButton = tenzies ? "New Game" : "Roll"

  return (
    <div className="mainContainer flex">
      <main className="flex">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="dieContainer grid">
          {allDices}
        </div>
        <input onClick={rollDice} type="submit" value={optionsOfButton} className="rollButton"></input>
        {tenzies && <Confetti />}
      </main>
    </div>
  );
}

export default App;
