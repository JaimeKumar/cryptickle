import { useEffect, useState } from 'react';
import './App.css';
import clues from './cluesDB.json';
import Clue from './Clue.js'
import Crossword from './Crossword.js'
import { v4 as uuidv4 } from 'uuid';

// https://cryptics.georgeho.org/data/clues?_next=2000 //

function App() {

  let cluesArr = [...clues];
  const [thisClue, setClue] = useState({A: {clue: 'hey', cross: 1}, D: {clue: 'hey', cross: 1}});
  const [lettersA, setLettersA] = useState([]);
  const [lettersD, setLettersD] = useState([]);
  const [isCorrect, setCorrect] = useState(false);

  useEffect(() => {
    // hey
  }, [thisClue])

  useEffect(() => {
    getClue()
  }, [])
  
  function getClue() {
    setCorrect(false);
    let clueA = cluesArr[Math.floor(Math.random() * cluesArr.length)];
    let answerAshort = clueA.answer.slice(1, clueA.answer.length-1).replace(/\s/g, '');
    
    let clueD;
    let crossPointA;
    let crossPointD;
    
    cluesArr.forEach(() => {
      let randomIndex = Math.floor(Math.random() * cluesArr.length);
      let randomAns = cluesArr[randomIndex].answer.replace(/\s/g, '');
      for (let i = 1; i < randomAns.length - 1; i++) {
        if (answerAshort.includes(randomAns.charAt(i))) {
          crossPointA = (answerAshort.indexOf(randomAns.charAt(i))) + 1;
          crossPointD = i;
          clueD = cluesArr[randomIndex];
          return;
        }
      }
    })

    let tempLettersA = [...clueA.answer.replace(/\s/g, '')].map(letter => ({
      char: letter,
      id: uuidv4(),
      selected: false
    }))

    let tempLettersD = [...clueD.answer.replace(/\s/g, '')].map(letter => ({
      char: letter,
      id: uuidv4(),
      selected: false
    }))

    tempLettersA[0].selected = true;
    
    setLettersA([...tempLettersA])
    setLettersD([...tempLettersD])
    setClue({A: {clue: clueA, cross: crossPointA}, D: {clue: clueD, cross: crossPointD}});
  }

  function clickLB(which, id) {
    let tempLettersA = [...lettersA.map(letter => ({
      ...letter,
      selected: false
    }))];
    let tempLettersD = [...lettersD.map(letter => ({
      ...letter,
      selected: false
    }))];

    if (which==='A') {
      tempLettersA.find(l => l.id===id).selected = true;
    } else {
      tempLettersD.find(l => l.id===id).selected = true;
    }

    setLettersA([...tempLettersA]);
    setLettersD([...tempLettersD]);
  }

  function checkAnswer() {
    let correctAns = 0;
    lettersA.forEach(letter => {
      if (document.getElementById(letter.id).value.toUpperCase() === letter.char) {
        correctAns++;
      } else {
        document.getElementById(letter.id).value = '';
      }
    })
    lettersD.forEach(letter => {
      if (document.getElementById(letter.id).value.toUpperCase() === letter.char) {
        correctAns++;
      } else {
        document.getElementById(letter.id).value = '';
      }
    })

    if (correctAns >= (lettersA.length + lettersD.length - 1)) {
      setCorrect(true)
    }
  }

  function pressedKey(e) {
    let dir = 'D';
    let currentPos = lettersD.indexOf(lettersD.find(l => l.selected));
    if (currentPos < 0) {
      currentPos = lettersA.indexOf(lettersA.find(l => l.selected));
      dir = 'A'
    }
    if (currentPos < 0) return;

    if (dir==='A') {
      if ((e.key === 'ArrowRight' || (e.key.length===1 && e.key.match(/[a-z]/i))) && currentPos < lettersA.length - 1) {
        currentPos++;
      } else if ((e.key === 'ArrowLeft' || e.key === 'Backspace') && currentPos > 0) {
        currentPos--;
      }
      let tempLetters = [...lettersA.map(letter => ({
        ...letter,
        selected: false
      }))];
      tempLetters[currentPos].selected = true;
      setLettersA([...tempLetters]);
      document.getElementById(tempLetters[currentPos].id).focus();
    } else {
      if ((e.key === 'ArrowDown' || (e.key.length===1 && e.key.match(/[a-z]/i))) && currentPos < lettersD.length - 1) {
        currentPos++;
      } else if ((e.key === 'ArrowUp' || e.key === 'Backspace') && currentPos > 0) {
        currentPos--;
      }
      let tempLetters = [...lettersD.map(letter => ({
        ...letter,
        selected: false
      }))];
      
      tempLetters[currentPos].selected = true;
      document.getElementById(tempLetters[currentPos].id).focus();
      setLettersD([...tempLetters]);
    }

    
  }

  function revealOne() {
    let selected = lettersA.find(l => l.selected);
    if (!selected) {
      selected = lettersD.find(l => l.selected);
    }

    if (!selected) return;

    document.getElementById(selected.id).value = selected.char;
    document.getElementById(selected.id).disabled = true;
    pressedKey({key: 'a'})
  }


  return (
    <div className="mainContainer">
      
      <Crossword key={uuidv4} lettersA={lettersA} lettersD={lettersD} thisClue={thisClue} clickLB={clickLB} keyPress={pressedKey}/>

      <Clue clue={thisClue} correct={isCorrect} key={uuidv4()} />

      <div className="buttonsBar">
        <div className="button" onClick={getClue}>
          NEXT
        </div>
        <div className="button" onClick={checkAnswer}>
          SUBMIT
        </div>
        <div className="button" onClick={revealOne}>
          REVEAL
        </div>
      </div>

    </div>
  );
}

export default App;
