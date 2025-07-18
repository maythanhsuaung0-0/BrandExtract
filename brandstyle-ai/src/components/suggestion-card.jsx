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
            <div style={{ backgroundColor: current.toLowerCase() }}
              className="color"></div>
          }
          <div className="current">
            <div className='sub-title'>Current</div>
            <div className='span'>{current}</div>
          </div>
        </div>
        <div>
          <ArrowRight className='icon' />
        </div>
        <div>
          {type === 'color' &&
            <div style={{ backgroundColor: suggested.toLowerCase() }}
              className="color"></div>
          }

          <div className="suggested">
            <div className='sub-title'>Current</div>
            <div className='span'>{suggested}</div>
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
