import React from 'react';
import Letterbox from './Letterbox';

export default function Crossword({ mainClue, clickLB, clickedSubBox, keyPress, openClue }) {

    var clue = JSON.parse(mainClue);
    
    function clickedLB(char, letter) {
        clickLB(char, letter)
    }

    // function clickedSB(id) {
    //     clickedSubBox(id)
    // }

    function pressedKey(e) {
        keyPress(e);
    }

    function clueOpened(id) {
        openClue(id)
    }

    return (
        <div className="innerContainer">
            {clue.letters.map((letter, i) => {
                return (
                    <div>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            {[...letter.clue.letters].map((l, j) => {
                                return <Letterbox key={l.id} letter={letter} i={i} char={l} j={j} clickLB={clickedLB} pressedKey={pressedKey} clueLength={clue.letters.length} />
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
