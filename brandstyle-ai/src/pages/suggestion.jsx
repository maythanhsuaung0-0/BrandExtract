import React from 'react';
import { Palette,TypeOutline } from 'lucide-react';
import '../components/css/suggestions.css';
import SuggestionCard from '../components/suggestion-card.jsx';
const SuggestionPage = () => {
  const colorSwapPairs = [
    { current: 'Cyan', suggested: 'Blue' },
    { current: 'Magenta', suggested: 'Pink' },
    { current: 'Yellow', suggested: 'Lemon' },
    { current: 'Black', suggested: 'Charcoal' }
  ];
  const fontSwapPairs = [
    { current: 'Arial', suggested: 'Helvetica' },
    { current: 'Times New Roman', suggested: 'Georgia' },
    { current: 'Courier New', suggested: 'Monaco' },
    { current: 'Verdana', suggested: 'Tahoma' }
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
          <div className='suggestion-list'>
            {colorSwapPairs.map((pair, index) => (
              <SuggestionCard type={'color'} key={index} current={pair.current} suggested={pair.suggested} />
            ))}

          </div>
        </div>
        <div >
          <h4 className='suggestion-title'>
            <TypeOutline className="icon" />
            <span>Font Updates</span></h4>
          <div className='suggestion-list'>
            {fontSwapPairs.map((pair, index) => (
              <SuggestionCard type='font' key={index} current={pair.current} suggested={pair.suggested} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SuggestionPage;
