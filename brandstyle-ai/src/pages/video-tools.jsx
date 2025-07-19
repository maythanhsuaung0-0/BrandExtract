import React from 'react';
import { Sparkles } from 'lucide-react';
import '../components/css/video-tools.css';
import { Button } from '@swc-react/button';
const VideoTools = () => {
  return (
    <div className="container">
      <h3 className='page-title'>Video Tools</h3>
      <p>Here you can find various tools to enhance your video editing experience.</p>
      <div className="wrapper">
        <div className="video-card">
          <span>Intro/Outtro Style</span>
          <select name="intro-outtro" id="intro-outtro">
            <option value="">Select Style</option>
            <option value="style1">Style 1</option>
            <option value="style2">Style 2</option>
            <option value="style3">Style 3</option>
          </select>
          <Button>
            <Sparkles className='icon' />
            <span>Generate Intro/Outro</span></Button>
        </div>
      </div>
    </div>
  );
}
export default VideoTools;
