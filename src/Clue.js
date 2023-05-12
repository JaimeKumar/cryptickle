import React, { Fragment } from 'react'

export default function Clue({ clue, reveal, sbs, hinted }) {

  let downClue = [clue.down.clue, '', ''];
  let inner = clue.down.clue;

  if (hinted.val > 0) {
    let def = clue.down.definition;
    if (def.includes('/')) def = def.splice(0, def.indexOf('/'));
    let pos = inner.indexOf(def);
    downClue = [inner.slice(0, pos), def, inner.slice(pos + def.length)]
  }

  if (clue.across.clue.length > 0) {
    return (
      <div id='clueBox' className='clue'>
        <strong>Down:&nbsp;</strong>{downClue[0]}<u>{downClue[1]}</u>{downClue[2]}
        <br/>
        <br/>
        <strong>Across:&nbsp;</strong>{clue.across.clue}
      </div>  
    )
  } else if (sbs.indexOf(sbs.find(sb => sb.selected)) < 0) {
    return (
      <div id='clueBox' className='clue'>
        <strong>Down:&nbsp;</strong>{downClue[0]}<u>{downClue[1]}</u>{downClue[2]}
        <br/>
        <br/>
        <p>&nbsp;</p>
      </div>
    )
  } else {
    return (
      <div id='clueBox' className='clue'>
        <strong>Down:&nbsp;</strong>{downClue[0]}<u>{downClue[1]}</u>{downClue[2]}
        <br/>
        <br/>
        <p style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={reveal}>Reveal Across Clue</p>
      </div>
    )
  }
}
