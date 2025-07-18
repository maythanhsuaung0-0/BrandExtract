import React from 'react';
import { Palette, TypeOutline } from 'lucide-react';
import '../components/css/suggestions.css';
import SuggestionCard from '../components/suggestion-card.jsx';
const SuggestionPage = () => {
  const colorSwapPairs = [
    {
      current: {
        name: 'Red',
        hex: '#FF0000'
      }
      , suggested: {
        name: 'Orange',
        hex: '#FFA500'
      }
    },
    {
      current: {
        name: 'Green',
        hex: '#008000'
      },
      suggested: {
        name: 'Lime',
        hex: '#00FF00'
      }
    },
    {
      current: {
        name: 'Blue',
        hex: '#0000FF'
      },
      suggested: {
        name: 'Cyan',
        hex: '#00FFFF'
      }
    },
    {
      current: {
        name: 'Purple',
        hex: '#800080'
      },
      suggested: {
        name: 'Violet',
        hex: '#EE82EE'
      }
    }
  ];
  const fontSwapPairs = [
    {
      current: {
        name: 'Arial'
      },
      suggested: {
        name: 'Helvetica'
      }
    }
    ,
    {
      current: {
        name: 'Times New Roman'
      },
      suggested: {
        name: 'Georgia'
      }
    },
    {
      current: {
        name: 'Courier New'
      },
      suggested: {
        name: 'Consolas'
      }
    }
  ];
  return (
    <div className="container">
      <h3 className='page-title'>Suggestion Page</h3>
      <p>Apply these changes to keep your design on-brand.</p>

      <div className="suggestion-content">
        <div>
          <h4 className='suggestion-title'>
            <Palette className='icon' />
            <span>Color Updates</span></h4>
          <div className='suggestion-table'>
            <div className='titles'><span>Current</span> <span>Suggested</span></div>
            <div className='suggestion-list'>
              {colorSwapPairs.map((pair, index) => (
                <SuggestionCard type={'color'} key={index} current={pair.current} suggested={pair.suggested} />
              ))}
            </div>
          </div>
        </div>
        <div >
          <h4 className='suggestion-title'>
            <TypeOutline className="icon" />
            <span>Font Updates</span></h4>

          <div className='suggestion-table'>
            <div className='titles'><span>Current</span> <span>Suggested</span></div>
            <div className='suggestion-list'>
              {fontSwapPairs.map((pair, index) => (
                <SuggestionCard type='font' key={index} current={pair.current} suggested={pair.suggested} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SuggestionPage;
