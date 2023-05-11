import React from 'react'

export default function Clue({ clue, reveal, sbs }) {
  if (clue.across.clue.length > 0) {
    return (
      <div id='clueBox' className='clue'>
        <strong>Down:&nbsp;</strong>{clue.down.clue}
        <br/>
        <br/>
        <strong>Across:&nbsp;</strong>{clue.across.clue}
      </div>  
    )
  } else if (sbs.indexOf(sbs.find(sb => sb.selected)) < 0) {
    return (
      <div id='clueBox' className='clue'>
        <strong>Down:&nbsp;</strong>{clue.down.clue}
        <br/>
        <br/>
        <p>&nbsp;</p>
      </div>
    )
  } else {
    return (
      <div id='clueBox' className='clue'>
        <strong>Down:&nbsp;</strong>{clue.down.clue}
        <br/>
        <br/>
        <p style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={reveal}>Reveal Across Clue</p>
      </div>
    )
  }
}
