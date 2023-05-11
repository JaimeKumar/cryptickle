import React from "react";

export default function Letterbox({clueLength, letter, i, clickLB, pressedKey}) {

  function lbClicked() {
    clickLB(letter.id);
  }

  function keyPressed(e) {
    if (e.target.value.length > 0 && e.key.length===1 && e.key.match(/[a-z]/i)) {
      if (!letter.confirmed) {
        e.target.value = e.key;
        pressedKey({key: 'push'})
        e.preventDefault()
      } else if (letter.confirmed) {
        pressedKey({key: 'push'})
        e.preventDefault()
      }
      return;
    }

    if (e.key === 'Backspace') {
      if (e.target.value.length < 1 || letter.confirmed) {
        e.preventDefault()
        pressedKey({key: 'pull'});
      }
    } else if (e.key.match(/[a-z]/i) || e.key.includes('Arrow')) {
      pressedKey(e);
    } else {
      e.preventDefault();
    }
  }

  function lbChange(e) {
    if (letter.confirmed) {
      e.preventDefault();
    }
    if (e.target.value.length > 0) {
      pressedKey({key: 'push'})
    }
  }

  let style = {
    transform: 'translate(-15px, ' + ((i - (clueLength/2)) * 30) + 'px)'
  };

  if (letter.char === '-') {
    letter.confirmed = true;
    style.writingMode = 'vertical-rl';
    letter.inp = '-';
  }

  let defVal = '';
  if (letter.confirmed) {
    defVal = letter.inp;
  }
  
  if (letter.space) {
    style.borderTop = '3px solid var(--fg)'
  }

  return (
    <input className='letterBox' autoFocus={(i===letter.crossPos)} id={letter.id} style={style} defaultValue={defVal} onClick={lbClicked} onKeyDown={keyPressed} onChange={lbChange} maxLength={1}></input>
  ) 
}
