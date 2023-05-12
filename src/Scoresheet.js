import React from 'react'

export default function Scoresheet({score, helpers, l, keepSolving}) {
  return (
    <div className="scoreContainer">
        <h3>CORRECT!</h3>
        {/* <div className="scoreBall">

        </div> */}
        <div className='scoreComponent'>
            <big>Score:&nbsp;</big>
            <strong>{score}</strong>
            <br/>
            <br/>
            {Object.keys(helpers).map(key => {
              if (helpers[key].val < 1) return;
              let loss = Math.floor(helpers[key].val * helpers[key].mul);
              if (helpers[key].div) {
                loss = Math.floor(helpers[key].val * (helpers[key].mul/l));
              }
              console.log(loss);
              return <p>{helpers[key].title} &nbsp; <span>-{loss}</span></p>
            })}
            {/* <p>Checks: {helpers.checks} &nbsp; <span>-{Math.floor(helpers.checks * 3)}</span></p>
            <p>Reveals: {helpers.reveals} &nbsp; <span>-{Math.floor(helpers.reveals * (100/l))}</span></p>
            <p>Across Clues: {helpers.opened} &nbsp; <span>-{Math.floor(helpers.opened * (10/l))}</span></p>
            <p>Across Reveals: {helpers.sideReveals} <span>&nbsp; -{Math.floor(helpers.sideReveals * (10/l))}</span></p> */}
        </div>
        <div className="button" style={{textDecoration: 'underline', height: '40px'}} onClick={keepSolving}>
            Keep Solving
        </div>
    </div>
  )
}
