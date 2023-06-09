import React from 'react'

export default function Button({ text, imgs, mode, func }) {
  if (imgs.length > 0) {
    let img = imgs[0];
    if (mode) {
        img = imgs[1];
    }
    return (
      <div className="button" onClick={func}>
          <img className='buttonImg' src={img} alt={text + " button"} />
          {text}
      </div>
    )
  } else {
    return (
      <div style={{fontFamily: 'Roboto'}}>
        {text}
      </div>
    )
  }
}
