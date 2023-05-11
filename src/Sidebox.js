import React from "react";

export default function Letterbox({clueLength, row, i, sb, j, clickSB, pressedKey, saveInp}) {

  function clickedSB(e) {
    clickSB(e, i)
  }

  function keyPressed(e) {
    if (e.target.value.length > 0 && e.key.length===1 && e.key.match(/[a-z]/i) && !sb.confirmed) {
      e.target.value = e.key;
      pressedKey({key: 'pushSB', target: e.target})
      e.preventDefault()
    } else if (sb.confirmed) {
      pressedKey({key: 'pushSB', target: e.target})
      e.preventDefault()
    }

    if (e.key === 'Backspace') {
      if (e.target.value.length < 1 || sb.confirmed) {
        e.preventDefault()
        pressedKey({key: 'ArrowLeft', target: e.target});
      } else {
        saveInp(e);
      }
    } else if (e.key.match(/[a-z]/i) || e.key.includes('Arrow')) {
      pressedKey(e);
    } else {
      e.preventDefault();
    }
  }

  function sbChange(e) {
    if (e.target.value.length > 0) {
      pressedKey({key: 'pushSB', target: e.target})
    }
  }

  let style = {
    transform: 'translate(' + (((j - row.crossPos) * 30) - 15) + 'px, ' + ((i - (clueLength/2)) * 30) + 'px)',
    zIndex: 1
  };

  if (!row.opened) {
    style.borderColor = 'var(--fg2)';
    style.cursor = 'pointer';
  }
  
  if (row.opened && sb.char === '-') {
    sb.confirmed = true;
    sb.char = '-';
  }

  if (sb.space && row.opened) {
    style.borderLeft = '3px solid var(--fg)'
  }

  if (row.crossPos===j) {
    return
  } else {
    return (
      <input className='letterBox' id={sb.id} style={style} maxLength={1} defaultValue={sb.inp} onClick={clickedSB} onKeyDown={keyPressed} onChange={sbChange}></input>
    ) 
  }
}
