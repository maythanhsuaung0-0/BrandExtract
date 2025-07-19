import React, { useState, useRef } from 'react';
import '../components/css/createBrand.css';
import { Button } from "@swc-react/button";
import { Accordion, AccordionItem } from "@swc-react/accordion";
import { PlusCircle } from 'lucide-react';
const CreateBrand = () => {
  const [url, setUrl] = useState('');
  const paletterContainerRef = useRef(null);
  function handleUrlChange(event) {
    event.preventDefault();
    setUrl(event.target.value);
  }
  function handleClick() {
    console.log("URL entered:", url);
  }
  function addPalette(event) {
    console.log(event.target.value,"color")
    let color = event.target.value
    const paletteContainer = paletterContainerRef.current;
    if (paletteContainer) {
      const newPalette = document.createElement('div');
      newPalette.className = 'color';
      newPalette.style.backgroundColor = color; // Default color
      newPalette.style.marginRight = '0.5em';
      newPalette.contentEditable = true; // Make it editable
      paletteContainer.style.marginBottom ="1em"
      paletteContainer.appendChild(newPalette);
    }
  }

  const [isdropping, setIsDropping] = useState(false);
  const [files, setFiles] = useState([]);
  const dropZoneRef = useRef(null);
  function handleDragOver(event) {
    event.preventDefault();
    setIsDropping(true);
  }
  function handleFileInputChange(event) {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      console.log("Files selected:", selectedFiles);
      setFiles(selectedFiles);
    }
  }
  function handleFileDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length > 0) {
      console.log("Files dropped:", files);
      setFiles(files);
      setIsDropping(false);
      // Handle file upload logic here
    }
  }

  return (<div className="container">
    <h3 className='page-title'>Create Your Own Brand Theme</h3>
    <p>Upload your favorite theme and save it.</p>
    <div className='upload'>
      <Accordion size='s'>
        <AccordionItem label={"Upload Your Font"}>
          <div className='url'>
            <div>
              <label htmlFor="url" className='label'>Font</label>
              <input type="text" id="url"
                placeholder="type your font name (eg.Arial)" value={url} onChange={handleUrlChange}
                className='input-url' />
            </div>
            <Button className='btn' size="m" onClick={handleClick}>
              Enter Font
            </Button>
          </div>

        </AccordionItem>
        <AccordionItem label={"Upload Your Color Palette"}>
          <div className='palette-container' ref={paletterContainerRef} ></div>
          <div className='color-field'>
            <input type="color" className='input-file' onChange={addPalette} />
            <button className="add-palette" >
              <PlusCircle className='icon' />
              <span > Add Color</span></button>
          </div>
        </AccordionItem>
        <AccordionItem label={"Upload Your Logo"}>
          <div ref={dropZoneRef}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            className={`drag-drop-area ${isdropping ? 'dropping' : ''}`}>
            <div className="drag-drop-content">
              <div className='upload-file' size="m" >
                <Button size="m">
                  <span className='upload-icon'>
                    Upload Files
                  </span>
                </Button>
                <input type="file" onChange={handleFileInputChange} className='input-file' />
              </div>
              <span className='span'>or</span>
              <div>Drop your files here</div>
            </div>
          </div>


        </AccordionItem>
      </Accordion>
      <Button className='save-brand'>
        Save Brand
      </Button>
    </div>
  </div>)
}
export default CreateBrand;
