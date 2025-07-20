import React, { useState, useRef } from 'react';
import '../components/css/createBrand.css';
import { Button } from "@swc-react/button";
import { Accordion, AccordionItem } from "@swc-react/accordion";
import { PlusCircle } from 'lucide-react';
import { useAuth } from '../authContext';
import { createBrand } from '../services/brands';
import Login from '../components/login';
import toast from 'react-hot-toast'
const CreateBrand = () => {
  const { user, token } = useAuth()
  const [font, setFont] = useState()
  const [brandName, setBrandName] = useState(null)
  const [colors, setColors] = useState([])
  const paletterContainerRef = useRef(null);
  const [logoUrl, setLogoUrl] = useState(null)
  const [disable, setDisable] = useState(true)
  const fontsContainerRef = useRef(null)
  const fontIndex = useRef(0)

  // for files
  //  const [file, setFile] = useState('');
  // const [previewUrl, setPreviewUrl] = useState()
  //const dropZoneRef = useRef(null);
  //const [isdropping, setIsDropping] = useState(false);

  function handleBrandNameChange(event) {
    event.preventDefault();
    setBrandName(event.target.value);
  }

  function handleLogoUrlChange(event) {
    event.preventDefault()
    setLogoUrl(event.target.value)
  }
  function handleFontChange(event) {
    let val = event.target.value
    setFont(val);
  }
  function addFonts(event) {
    let index = fontIndex.current++;
    let fontContainer = fontsContainerRef.current
    if (fontContainer) {
      const container = document.createElement('div');
      const label = document.createElement('label');
      label.setAttribute('for', `font-${index}`);
      label.className = 'label';
      label.textContent = 'Font';
      // input
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `font-${index}`;
      input.placeholder = 'type your font name (eg.Arial)';
      input.className = 'input-url';
      container.classList.add("margin-sm")
      container.appendChild(label);
      container.appendChild(input);
      fontContainer.appendChild(container)
    }
  }
  function addPalette(event) {
    console.log(event.target.value, "color")
    let color = event.target.value
    const paletteContainer = paletterContainerRef.current;
    if (paletteContainer) {
      const newPalette = document.createElement('div');
      newPalette.className = 'color';
      newPalette.style.backgroundColor = color; // Default color
      newPalette.style.marginRight = '0.5em';
      newPalette.contentEditable = true; // Make it editable
      paletteContainer.style.marginBottom = "1em"
      paletteContainer.appendChild(newPalette);
      colors.push(color)
      setColors(colors)
    }
  }
  // for handling files
  // function handleDragOver(event) {
  //   event.preventDefault();
  //   setIsDropping(true);
  // }
  // function handleFileInputChange(event) {
  //   const selectedFiles = event.target.files;
  //   if (selectedFiles.length > 0) {
  //     console.log("Files selected:", selectedFiles);
  //     setFile(selectedFiles[0]);
  //     readFile(selectedFiles[0], setPreviewUrl)
  //   }
  // }
  // function handleFileDrop(event) {
  //   event.preventDefault();
  //   const files = event.dataTransfer.files;
  //
  //   if (files.length > 0) {
  //     console.log("Files dropped:", files);
  //     setFile(files[0]);
  //     setIsDropping(false);
  //     readFile(files[0], setPreviewUrl)
  //     // Handle file upload logic here
  //
  //   }
  // }
  async function saveBrand() {

    const paletteContainer = paletterContainerRef.current;
    const dynamicInputs = fontsContainerRef.current.querySelectorAll("input")
    const dynamicFonts = Array.from(dynamicInputs).map((input) => input.value)
    let allFonts = []
    if (dynamicFonts) {
      allFonts.push(...dynamicFonts)
    }
    if (font) {
      allFonts.push(font)
    }

    console.log(allFonts, logoUrl, colors, brandName)
    // add file checking here as well if we use file
    if (logoUrl == null && colors.length <= 0 && brandName == null && allFonts.length <= 0) {
      toast('Form cannot be empty')
    }
    else {
      console.log(brandName, colors, dynamicFonts, logoUrl)
      console.log(logoUrl == null && colors.length < 0 && brandName == null && allFonts
        .length < 0)
      const data = {
        name: brandName,
        colors: colors,
        fonts: allFonts,
        logo_url: logoUrl
      }
      if (token) {
        let res = await createBrand(data, token)
        console.log('res', res)
        if (res?.status === 201) {
          toast.success('Saved brand successfully')
          setLogoUrl('')
          setBrandName('')
          paletteContainer = "<div></div>"
        }
        else {
          console.log('err shows up')
          toast.error("Could'nt save brand, make sure you filled everything")
        }
      }
    }
  }

  return (<div className="container">
    <h3 className='page-title'>Create Your Own Brand Theme</h3>
    <p>Upload your favorite theme and save it.</p>
    <div className='upload'>
      <Accordion size='s'>
        <AccordionItem label={"Upload Your Font"}>
          <div className='margin-x-lg'>
            <div className='url'>
              <div className='margin-sm'>
                <label htmlFor="font-0" className='label'>Font</label>
                <input type="text" id="font-0"
                  placeholder="type your font name (eg.Arial)"
                  value={font}
                  onChange={handleFontChange}
                  className='input-url' />
              </div>

              <div ref={fontsContainerRef} className='fonts-container'></div>
              <button className="add-palette" onClick={addFonts} >
                <PlusCircle className='icon' />
                <span > Add Fonts</span></button>
            </div>
          </div>
        </AccordionItem>
        <AccordionItem label={"Upload Your Color Palette"}>

          <div className='margin-x-lg'>
            <div className='url'>
              <div className='palette-container' ref={paletterContainerRef} ></div>
              <div className='color-field'>
                <input type="color" className='input-file' onChange={addPalette} />
                <button className="add-palette" >
                  <PlusCircle className='icon' />
                  <span > Add Color</span></button>
              </div>
            </div>
          </div>
        </AccordionItem>
        <AccordionItem label={"Upload Your Logo"}>
          <div className='url' style={{ marginTop: "1em" }}>
            <div>
              <label htmlFor="logoUrl" className='label'>Your Logo URL</label>
              <input type="text" id="logoUrl"
                placeholder="Enter your logo url (eg.https://www.logo.url)" value={logoUrl}
                onChange={handleLogoUrlChange}
                className='input-url' />
            </div>
          </div>

          {/*    for uploading file
          {!previewUrl ?
          <div ref={dropZoneRef}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          className={`drag-drop-area ${isdropping ? 'dropping' : ''}`}>
          <div className="drag-drop-content">
          <div className='upload-file' size="m" >
          <Button size="m">
          <span className='upload-icon'>
          Upload Logo File
          </span>
          </Button>
          <input type="file" onChange={handleFileInputChange} className='input-file' />
          </div>
          <span className='span'>or</span>
          <div>Drop your logo file here</div>
          </div>
          </div>
          : <img src={previewUrl} alt='logo' className='logoFile' />
          } */}
        </AccordionItem>
      </Accordion>
      <div className='url' style={{ marginTop: "1em" }}>
        <div>
          <label htmlFor="brandName" className='label'>Your Brand Name</label>
          <input type="text" id="brandName"
            placeholder="type your brand name " value={brandName}
            onChange={handleBrandNameChange}
            className='input-url' />
        </div>
      </div>
      <div className='flex-row margin-lg'>

        <Button disabled={token ? false : true} onClick={saveBrand}>
          Save Brand
        </Button>
        {!token && <Login />}
      </div>
    </div>
  </div >)
}
export default CreateBrand;

const readFile = (file, setPreviewUrl) => {
  console.log(file, file.type, 'f')
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }

    reader.readAsDataURL(file)
  }
  else {
    alert("Unsupported File Type, only image files")
    setPreviewUrl(null)
  }
}
