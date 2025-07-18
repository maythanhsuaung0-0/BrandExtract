import React from 'react';
import { ArrowRight } from 'lucide-react';
import './css/suggestions.css';
import { Button } from '@swc-react/button';
const SuggestionCard = ({ type, current, suggested }) => {
  return (

    <div className="suggestion">
      <div className='suggestion-item'>
        <div>
          {type === 'color' &&
            <div style={{ backgroundColor: current.hex }}
              className="color"></div>
          }
          <div className="current">
            {type === "font" ? <div className='sub-title' style={{ fontFamily: current.name }}>{current.name}</div> :
              <div className='sub-title'>{current.name}</div>}
            <div className='span'>{type === "color" ? current.hex : current.name}</div>
          </div>
        </div>
        <div>
          <ArrowRight className='icon' />
        </div>
        <div>
          {type === 'color' &&
            <div style={{ backgroundColor: suggested.hex }}
              className="color"></div>
          }

          <div className="suggested">
            {type === "font" ? <div className='sub-title' style={{ fontFamily: suggested.name }}>{suggested.name}</div> :
              <div className='sub-title'>{suggested.name}</div>}

            <div className='span'>{type === "color" ? suggested.hex : suggested.name}</div>
          </div>

        </div>
      </div>
      <div className='apply-btn'>
        <Button className='btn' size='s'>Apply</Button>
      </div>
    </div>
  )
}
export default SuggestionCard;
