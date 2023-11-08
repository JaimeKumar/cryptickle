import { useEffect, useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import $ from 'jquery';
import clues from './cluesDB.json';
import Clue from './Clue.js'
import Button from './Button'
import Sidebox from './Sidebox'
import Letterbox from './Letterbox'
import Scoresheet from './Scoresheet';

import checkButtonLight from './checkLight.svg';
import checkButtonDark from './checkDark.svg';
import revealButtonLight from './revealLight.svg';
import revealButtonDark from './revealDark.svg';
import hintLight from './hintLight.svg';
import hintDark from './hintDark.svg';
import helpIMG1 from './helpIMG1.png';

// https://cryptics.georgeho.org/data/clues?_next=2000 //

function App() {

  let cluesArr = [...clues];

  const [letterboxes, setLBs] = useState([]);
  const [sideboxes, setSBs] = useState([]);
  const [cluesState, setClues] = useState({down: {clue: ''}, across: {clue: ''}});
  const [helpers, setHelp] = useState({
    checks: {title: 'Check', val: 0, mul: 3}, 
    reveals: {title: 'Reveals', val: 0, mul: 100, div: true}, 
    sideReveals: {title: 'Across Reveals', val: 0, mul: 10, div: true}, 
    opened: {title: 'Across clues', val: 0, val: 0, mul: 10, div: true}, 
    hintUsed: {title: 'Hint Used', val: 0, mul: 10, div: false}
  });
  const [selected, setSelected] = useState();
  const [score, setScore] = useState(null);
  const [darkMode, setMode] = useState(false);
  const modes = ['Dark Mode', 'Light Mode'];

  useEffect(() => {
    getMain();
  }, [])

  useEffect(() => {
    updateClue();
    scaleCW();
  }, [sideboxes])

  useEffect(() => {
    let r = $(':root');
    if (darkMode) {
      r.css('--bkg', '#000612');
      r.css('--bkg2', '#75c0d21f');
      r.css('--fg', '#aaeeff');
      r.css('--fg2', '#618791');
    } else {
      r.css('--bkg', '#fff');
      r.css('--bkg2', '#005fef14');
      r.css('--fg', '#000');
      r.css('--fg2', '#c0c0c0');
    }
  }, [darkMode])
  
  function getMain() {
    let tempClue = cluesArr[Math.floor(Math.random() * cluesArr.length)];

    if (tempClue.answer.length > 9) {
      getMain();
      return;
    }

    let tempLetters = [...[...tempClue.answer].map((letter, i) => {
      if (letter === ' ') return ' ';
      let sideClue = getClue(letter, tempClue);
      sideClue.letters = [...[...sideClue.answer].map((letter, j) => {
        if (letter === ' ') return ' ';
        return( {
          char: letter,
          id: uuidv4(),
          space: ([...sideClue.answer][j - 1] === ' '),
          confirmed: (letter === '-')
        })
      }).filter(letter => {
        if (letter === ' ') {
          return false;
        } else {
          return true;
        }
      })]
      return {
        char: letter,
        id: uuidv4(),
        selected: false,
        clue: sideClue,
        crossPos: sideClue.answer.replace(/\s/g, '').indexOf(letter),
        opened: false,
        cursor: sideClue.answer.replace(/\s/g, '').indexOf(letter),
        space: ([...tempClue.answer][i - 1] === ' ')
      }
    })].filter((letter) => {
      if (letter === ' ') {
        return false;
      } else {
        return true;
      }
    })

    setLBs(tempLetters.map((letter) => ({
      id: letter.id,
      char: letter.char,
      confirmed: (letter === '-'),
      sideclue: letter.clue,
      space: letter.space,
      def: tempClue.definition
    })));

    setSBs(tempLetters.map((letter) => {
      return (
        {
          selected: false,
          crossPos: letter.crossPos,
          opened: false,
          letters: letter.clue.letters.map(l => ({
            id: l.id,
            char: l.char,
            confirmed: (letter === '-'),
            inp: '',
            space: l.space
          }))
        }
      )
    }));

    setClues(p => ({
      ...p,
      down: tempClue
    }));
  }
  
  function getClue(char, currentClue) {
    for (var i in cluesArr) {
      let rIndex = Math.floor(Math.random() * (cluesArr.length))
      if (cluesArr[rIndex].clue === currentClue.clue) continue;
      if (cluesArr[rIndex].answer.replace(/\s/g, '').length > currentClue.answer.length + 4) continue;

      if (cluesArr[rIndex].answer.slice(1, cluesArr[rIndex].answer.length-1).replace(/\s/g, '').includes(char)) {
        return cluesArr[rIndex];
      } 
    }
  }

  function updateClue() {
    let i = sideboxes.indexOf(sideboxes.find(sb => sb.selected));
    let acr = {clue: ''};
    if (i < 0) return;
    if (sideboxes[i].opened) {
      acr = letterboxes[i].sideclue
    }
    setClues(p => ({
      ...p,
      across: acr
    }))
  }

  function clickLB(id) {
    let index = letterboxes.indexOf(letterboxes.find(l => l.id===id));
    let sbCopy = sideboxes.map(sb => ({
      ...sb,
      selected: false
    }))

    sbCopy[index].selected = true;
    setSelected(id);
    setSBs(sbCopy);
  }

  function clickedSB(e, i) {
    let sbCopy = [...sideboxes];
    sbCopy[i].opened = true;
    let copyopened = helpers.opened;
    copyopened.val++
    setHelp(p => ({
      ...p,
      opened: copyopened
    }))
    setSelected(e.target.id)
    setSBs(sbCopy);
    updateClue();
  }
  
  function openClue() {
    let x = sideboxes.indexOf(sideboxes.find(sb => sb.selected))
    if (x < 0) return;
    clickedSB({target: {id: sideboxes.find(sb => sb.selected).id}}, x)
  }

  function moveCursor(val) {
    let sbCopy = [...sideboxes];
    let pos = sbCopy.indexOf(sbCopy.find(sb => sb.selected));

    if (pos + val > -1 && pos + val < letterboxes.length) {
      sbCopy[pos].selected = false;
      
      if (letterboxes[pos + val].char === '-') {
        val *= 2;
      }
      
      sbCopy[pos + val].selected = true;
      
      setSBs(sbCopy)

      $('#' + letterboxes[pos + val].id).trigger('focus')
      setSelected(letterboxes[pos + val].id);
      updateClue();
    }
  }

  function moveSubCursor(e, val) {
    let row = sideboxes.indexOf(sideboxes.find(lb => lb.selected));
    let index = sideboxes[row].letters.indexOf(sideboxes[row].letters.find(sb => sb.id===e.target.id));

    if (index + val <= sideboxes[row].letters.length-1 && index + val > -1 && sideboxes[row].letters[index + val].char==='-') {
      val *= 2;
    }

    let nextID;
    if (index < 0) {
      if (sideboxes[row].letters[sideboxes[row].crossPos + val].char === '-') {
        nextID = sideboxes[row].letters[sideboxes[row].crossPos + (val * 2)].id;
      }
      nextID = sideboxes[row].letters[sideboxes[row].crossPos + val].id;
    } else if (index + val === sideboxes[row].crossPos) {
      nextID = letterboxes[row].id;
    } else if (index + val <= sideboxes[row].letters.length-1 && index + val > -1) {
      nextID = sideboxes[row].letters[index + val].id;
    }

    if (nextID) $('#' + nextID).trigger('focus');
    setSelected(nextID);
  }

  function saveSBinp(e) {
    let sbs = [...sideboxes];
    let row = sbs.indexOf(sbs.find(row => row.selected));
    if (sbs[row].letters.find(sb => sb.id === e.target.id).confirmed) return;
    sbs[row].letters.find(sb => sb.id === e.target.id).inp = e.target.value;
    setSBs(sbs);
  }

  function checkForCross(e, val) {
    let sbCopy = [...sideboxes];
    let row = sbCopy.indexOf(sbCopy.find(sb => sb.selected));
    if (sbCopy[row].opened) {
      if (sideboxes[row].letters[sideboxes[row].crossPos + val].char==='-') {
        val *= 2;
      }
      $('#' + sideboxes[row].letters[sideboxes[row].crossPos + val].id).trigger('focus');
      setSelected(sideboxes[row].letters[sideboxes[row].crossPos + val].id);
    } else {
      moveCursor(val);
    }
  }

  function pressedKeyLB(e) {
    if (e.key === 'ArrowUp') {
      moveCursor(-1);
    } else if (e.key === 'ArrowDown') {
      moveCursor(1);
    } else if (e.key === 'ArrowRight') {
      moveSubCursor(e, 1);
    } else if (e.key === 'ArrowLeft') {
      moveSubCursor(e, -1);
    } else if (e.key ==='push') {
      checkForCross(e, 1);
    } else if (e.key==='pull') {
      checkForCross(e, -1);
    } else if (e.key==='pushSB') {
      saveSBinp(e);
      moveSubCursor(e, 1)
    }
  }

  function checkAnswer() {
    console.log(score)
    let correct = 0;
    let wrong = 0;
    
    letterboxes.forEach(lb => {
      if (lb.char ==='-') {
        correct++;
        return;
      };
      if ($('#' + lb.id)[0].value.toUpperCase() !== lb.char) {
        $('#' + lb.id)[0].value = '';
        wrong++;
      } else {
        correct++;
      }
    })

    let sbs = [...sideboxes];
    sbs.forEach((row, i) => {
      row.letters.forEach((lb, j) => {
        if (lb.char ==='-' || j===row.crossPos || lb.confirmed) {
          return;
        }
        if (lb.inp.toUpperCase() !== lb.char) {
          sbs[i].letters[j].inp = '';
          if (row.selected) {
            $('#' + lb.id)[0].value = '';
          }
        }
      })
    })
    setSBs(sbs)

    if (wrong > 0) {
      let copychecks = helpers.checks;
      copychecks.val++;
      setHelp(p => ({
        ...p,
        checks: copychecks
      }))
    }

    if (correct >= letterboxes.length) {
      getScore();
    }
  }
  
  function getScore() {
    if (score) return;
    let tScore = 100;
    tScore -= Math.floor(helpers.reveals.val * (100/letterboxes.length));
    tScore -= Math.floor(helpers.sideReveals.val * (10/letterboxes.length));
    tScore -= Math.floor(helpers.opened.val * (10/letterboxes.length));
    tScore -= Math.floor(helpers.checks.val * 3);
    tScore -= Math.floor(helpers.hintUsed.val * 10);
    
    if (tScore < 0) tScore = 0;
    
    setScore(tScore);
    $('#scoreBox').css('display', 'flex')
  }
  
  function revealOne() {
    let isSB = false;
    let focused = letterboxes.find(lb => lb.id === selected);
    let row = sideboxes.indexOf(sideboxes.find(lb => lb.selected));
    if (row < 0) return;
    if (!focused) {
      focused = sideboxes[row].letters.find(sb => sb.id===selected);
      isSB = true;
    }
    if (!focused) return;

    let copyreveals = helpers.reveals;
    let copysides = helpers.sideReveals;
    
    if (isSB) {
      let sbs = [...sideboxes];
      sbs[row].letters.find(sb => sb === focused).inp = focused.char;
      sbs[row].letters.find(sb => sb === focused).confirmed = true;
      setSBs([...sbs]);
      pressedKeyLB({key: 'pushSB', target: focused})
      copysides.val++;
    } else {
      let lbs = [...letterboxes];
      lbs.find(lb => lb === focused).inp = focused.char;
      lbs.find(lb => lb === focused).confirmed = true;
      setLBs([...lbs]);
      pressedKeyLB({key: 'push'})
      copyreveals.val++;
    }
    $('#' + selected)[0].value = focused.char;
    
    setHelp(p => ({
      ...p,
      reveals: copyreveals,
      sideReveals: copysides
    }))
  }
  
  function changeMode() {
    setMode(!darkMode);
  }
  
  function keepSolving() {
    $('#scoreBox').css('display', 'none')
  }
  
  function scaleCW() {
    let longest = 0;
    sideboxes.forEach(sb => {
      if (sb.crossPos > longest) longest = sb.crossPos;
      if (sb.letters.length - sb.crossPos > longest) longest = sb.letters.length - sb.crossPos;
    })
    
    if ((longest + 0.5) * 31 > (window.screen.width/2)) {
      let scaling = (window.screen.width/2) / ((longest + 0.5) * 31);
      $('.crossword').css('transform', 'scale(' + scaling + ')');
    }
    
  }
  
  function openMenu() {
    $('.dropDown').toggleClass('openMenu')
    $('.mainContainer').toggleClass('mainShift')
  }
  
  function openHelp() {
    openMenu();
    $('#helpBox').css('display', 'flex')
  }
  
  function closeHelp() {
    $('#helpBox').css('display', 'none')
    lessHelp();
  }

  function moreHelp() {
    $('.pages').css('left', '-100%')
  }
  
  function lessHelp() {
    $('.pages').css('left', '-0%')
  }

  function giveHint() {
    let copyhint = helpers.hintUsed;
    copyhint.val++;
    setHelp(p => ({
      ...p,
      hintUsed: copyhint
    }))
  }
  
  return (
    <div className="bodyCont">
      <div className="menuButton" onClick={openMenu}>
          ☰
      </div>
      <div className="dropDown">
        <ul> 
          <li onClick={openHelp}>
            Help
          </li>
          <li onClick={changeMode}>
            <Button key={uuidv4()} text={modes[+ darkMode]} imgs={[]} />
          </li>
        </ul>
      </div>

      <div className="mainContainer">
        <div className="title">
          cryptickle
        </div>

        <div className="crossword">
          <div className="innerContainer">
            {letterboxes.map((lb, i) => {
              return <Letterbox key={lb.id} letter={lb} i={i} clueLength={letterboxes.length} clickLB={clickLB} pressedKey={pressedKeyLB} />
            })}
            
            {sideboxes.map((row, i) => {
              if (row.selected) {
                return row.letters.map((sb, j) => {
                  return <Sidebox key={sb.id} row={row} sb={sb} i={i} j={j} clueLength={letterboxes.length} clickSB={clickedSB} pressedKey={pressedKeyLB} saveInp={saveSBinp}/>
                })
              } else return null;
            })}
          </div>
        </div>

        <div className="clueBox">
          <Clue key={uuidv4()} clue={cluesState} sbs={sideboxes} reveal={openClue} hinted={helpers.hintUsed} />
        </div>

        <div className="footer">
          <div className="buttonsBar">
            <Button key={uuidv4()} mode={darkMode} text='Hint' imgs={[hintLight, hintDark]} func={giveHint}/>
            <Button key={uuidv4()} mode={darkMode} text='Reveal' imgs={[revealButtonLight, revealButtonDark]} func={revealOne}/>
            <Button key={uuidv4()} mode={darkMode} text='Check' imgs={[checkButtonLight, checkButtonDark]} func={checkAnswer}/>
          </div>
          <span className='footerText'>© Jaime Kumar, 2023. All rights reserved.</span>
        </div>
          
        <div id='scoreBox' className="overBox">
            <Scoresheet key={uuidv4()} score={score} helpers={helpers} l={letterboxes.length} keepSolving={keepSolving}/>
        </div>

        <div id='helpBox' className="overBox">
          <div className="helpContainer">
            <div className="pages">
              <div className="page" id='pg1'>
                <div className="close" style={{top: '15px', right: '20px'}} onClick={closeHelp}>
                  ✖
                </div>
                <div className="pageInner">
                <p style={{fontFamily: 'Roboto', fontWeight: 'bold'}}>How to play:</p>
                  <small>
                    Cryptickle is just a tickle of a cryptic crossword. More help on how to solve cryptic clues can be found on the next page.
                    The aim of cryptickle is to solve the down clue, ideally with as little help as possible. 
                  </small>
                  <ul>
                    <li>
                      Each time you check your answer, your score will be slightly reduced, mostly to stop you from trying every letter in the alphabet for each box.
                    </li>
                    <li>
                      Revealing a letter will significantly reduce your score. To be precise, each reveal used on the main (down) clue will reduce your score by its share of the answer length, so if you reveal every box you will get 0.
                    </li>
                    <li>
                      Revealing across-clue letters will also effect your score, but slightly less so.
                    </li>
                    <li>
                      Using the hint button will underline which part of clue defines the answer. This will mildly affect your score.
                    </li>
                    <li>
                      Finally, for each letter in the down clue, you have the option to open an across clue to help out. This will slightly reduce your score, but this feature is the essence of cryptickle so open those across clues with pride.
                      You can open an across clue by either clicking the greyed-out boxes as shown below, or by clicking the underlined text that reads 'Reveal Across Clue' in the clue section.
                    </li>
                  </ul>
                  <img src={helpIMG1} alt='help information diagram'/>
                </div>
                <div className="close" style={{bottom: '10px', fontSize: '1.5em', right: '15px'}} onClick={moreHelp}>
                  ➔
                </div>
              </div>

              <div className="page" id='pg2'>
                <div className="close" style={{top: '15px', right: '20px'}} onClick={closeHelp}>
                  ✖
                </div>
                <div className="pageInner">
                    <p style={{fontFamily: 'Roboto', fontWeight: 'bold'}}>Cryptic clues:</p>
                  <small>Clues will always start or end with a synonym of the answer's definition. 
                    Some words can also provide an indication of how you should solve the puzzle.</small>
                  <p style={{fontFamily: 'Roboto', fontWeight: 'bold'}}>Anagram indicators:</p>
                  <small>Words like <i>shuffled, mixed, confused, broken, drunk, smashed & upset</i> can all indicate you should find an anagram.</small>
                  <p style={{fontFamily: 'Roboto', fontWeight: 'bold'}}>Homophone indicators:</p>
                  <small>Phrases like <i>sounds like, I hear, I say, outspoken & reportedly</i> can all indicate the use of a homophone.</small>
                  <small style={{fontSize: '0.65em'}}>e.g - 'I hear a big cat isn't telling the truth' - sounds like Lion... LYING</small>
                  <p style={{fontFamily: 'Roboto', fontWeight: 'bold'}}>Reversal indicators:</p>
                  <small>These words suggest you should reverse a word or some letters: <i>reflected, flipped over, come back, knocked over & around.</i></small>
                  <p style={{fontFamily: 'Roboto', fontWeight: 'bold'}}>Hidden word indicators:</p>
                  <small>Phrases like <i>buried in, surrounded by, part of & a bit of</i> can indicate a word is hidden within another</small>
                  <p style={{fontFamily: 'Roboto', fontWeight: 'bold'}}>Deletion indicators:</p>
                  <small>Some words indicate you should remove some letters from a word, such as <i>excluding, without, dropped & cut</i>. Other words can refer to letter positions such as <i>opener, head, tail, end, half & center</i>, which can indicate you should build a word out of letters from other words.</small>
                </div>
                <div className="close" style={{fontSize: '1.5em', transform: 'rotate(180deg', bottom: '10px', left: '15px'}} onClick={lessHelp}>
                  ➔
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
