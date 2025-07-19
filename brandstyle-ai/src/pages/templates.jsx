import React from 'react';
import '../components/css/templates.css'
import Carousel from '../components/carousel';
const Templates = () => {

  return (
    <div className="container">

      <h3 className='page-title'>Templates</h3>
      <p>Browse templates styled to your brand—automatically. Choose what inspires you.</p>
      <div className='templates wrapper'>
        <div className="templates-carousel">
          <Carousel />
        </div>
      </div>

    </div>
  );
}
export default Templates;

