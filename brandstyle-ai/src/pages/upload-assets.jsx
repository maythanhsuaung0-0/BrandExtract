
import React, { useState, useRef } from 'react';
import { Button } from "@swc-react/button";
import '../components/css/upload-assets.css';
import { useAuth } from '../authContext';
import readFile from '../services/util';
import { extractBrand } from '../services/extract';
import { handleBrandifyClick } from '../services/brandify';  // See above!
import Login from '../components/login';
import { Heart } from 'lucide-react';
import { createBrand } from '../services/brands';
import toast from 'react-hot-toast';
import Modal from '../components/modal';
const UploadAssetPage = () => {
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const [isProcessing,setIsProcessing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isdropping, setIsDropping] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [url, setUrl] = useState('');
  const [chosenUrl, setChosenUrl] = useState(null);
  const [files, setFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null)
  const [brand, setbrand] = useState(null)
  const dropZoneRef = useRef(null);

  function handleUrlChange(event) {
    event.preventDefault();
    setUrl(event.target.value);
  }
  function handleBrandChange(event) {

    event.preventDefault();
    setbrand(event.target.value);
  }
  async function saveBrand() {
    console.log(brand, 'brand name')
let newData = { ...extractedData };
    setExtractedData({ name: brand, colors: extractedData.colors, fonts: extractedData.fonts, logo_url: extractedData?.logo_url })
    console.log(extractedData, 'is saved')

    if (token && extractedData) {
      if (brand) {
        newData.name = brand
      }
      if (extractedData.logo_url === null) {
        newData.logo_url = "https://dummyimage.com/600x400/ffffff/fff.jpg&text=placeholder" 
      }
      try {
        console.log('tryting to add',newData)
        let res = await createBrand(newData, token)
        if (res?.status === 201) {
          toast.success('Saved brand successfully')
        }
        else {
          toast.error("Could'nt save brand, make sure you filled everything")
        }

      } catch (error) {
        toast.error(error)
      }
    }

  }
  function handleClick() {
    setChosenUrl(url);
  }
  async function clickSaveBtn() {
    setIsOpen(true)
  }
  function handleDragOver(event) {
    event.preventDefault();
    setIsDropping(true);
  }

  function handleFileInputChange(event) {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      readFile(selectedFiles[0], setPreviewUrl);
    }
  }

  function handleFileDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length > 0) {
      setFiles(files);
      setIsDropping(false);
      readFile(files[0], setPreviewUrl);
    }
  }
  const closeModal = (state) => {
    setIsOpen(state)
  }

  async function createExtraction() {
    let formData = new FormData()
    if (files[0]) {
      formData.append("file", files[0]);
    }
    if (chosenUrl) {
      formData.append("url", chosenUrl);
    }

    if (files[0] !== null || chosenUrl !== null) {
      try {
        setLoading(true)
        let res = await extractBrand(formData, token)
        if (res.status === 200) {
          setExtractedData(res.data)
          console.log(res.data)
        }
        else {
          toast.error("Something went wrong, cannot extract brand")
        }
      }
      catch (err) {
        toast.error(err)
      }
      finally {
        setLoading(false)
      }
    }
    setIsProcessing(false);
  }

  // MAIN BRANDIFY FUNCTION
  async function handleBrandify() {
    console.log('was clicked')
    if (!extractedData) {
      alert("No brand data to apply. Extract brand first.");
      return;
    }

    setIsProcessing(true);

    try {
      // Calls the service that triggers the documentSandbox's brandify
      const result = await handleBrandifyClick(extractedData);
      setBrandifyResult(result);

      if (result && result.success) {
        alert("Brandify completed! Check your Adobe Express document.");
      } else {
        alert("Brandify failed: " + (result?.error || "Unknown error"));
      }
    } catch (error) {
      alert(`Brandification failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }

  // Live preview of brand styles
  function generateBrandPreview() {
    if (!extractedData) return null;

    const primaryColor = extractedData.colors?.[0] || '#000000';
    const secondaryColor = extractedData.colors?.[1] || '#666666';
    const primaryFont = extractedData.fonts?.[0] || 'Arial';

    return (
      <div style={{
        padding: '20px',
        backgroundColor: primaryColor + '10',
        border: `2px solid ${primaryColor}`,
        borderRadius: '8px',
        fontFamily: primaryFont,
        margin: '20px 0'
      }}>
        <h3 style={{ color: primaryColor, margin: '0 0 10px 0' }}>
          Brand Preview
        </h3>
        <p style={{ color: secondaryColor, margin: '0' }}>
          This is how your brand styling will look when applied to documents.
        </p>
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '10px',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '12px', color: secondaryColor }}>Colors:</span>
          {extractedData.colors?.slice(0, 3).map((color, i) => (
            <div key={i} style={{
              width: '20px',
              height: '20px',
              backgroundColor: color,
              borderRadius: '50%',
              border: '1px solid #ccc'
            }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Loading overlay */}
      {isProcessing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          color: 'white',
          fontSize: '18px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div>Processing...</div>
            <div style={{ fontSize: '14px', marginTop: '10px' }}>
              {extractedData ? 'Applying brand DNA to document...' : 'Extracting brand DNA...'}
            </div>
          </div>
        </div>
      )}

      {previewUrl || chosenUrl ? (
        <div>
          <img src={previewUrl || chosenUrl} alt="your selected file" className='logoFile' />
          <Button
            className='margin-md'
            disabled={!token || isProcessing}
            onClick={createExtraction}
          >
            {isProcessing ? 'Extracting...' : 'Extract Brand'}
          </Button>
          {!token && <Login />}
        </div>
      ) : (
        <div>
          <h3 className='page-title'>Brand DNA Extractor & Document Brandifier</h3>
          <p>Drop in a brand file or paste a URL, extract its DNA, and apply it to documents.</p>
          <div className='upload'>
            <div className='url'>
              <div>
                <label htmlFor="url" className='label'>Enter a URL</label>
                <input
                  type="text"
                  id="url"
                  placeholder="https://example.com/logo.png"
                  value={url}
                  onChange={handleUrlChange}
                  className='input-url'
                />
              </div>
              <Button className='btn' size="m" onClick={handleClick}>
                Enter URL
              </Button>
            </div>

            <span className='span'>OR</span>

            <div ref={dropZoneRef}
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              className={`drag-drop-area ${isdropping ? 'dropping' : ''}`}>
              <div className="drag-drop-content">
                <div className='upload-file' size="m">
                  <Button className='btn' size="m">
                    <span className='upload-icon'>Upload Files</span>
                  </Button>
                  <input type="file" onChange={handleFileInputChange} className='input-file' />
                </div>
                <span className='span'>or</span>
                <div>Drop your files here</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading &&
        <div> <img src="/Loading.gif" width={400} height={400} alt="generating..." className='gif' /></div>
      }
      {/* show extracted brand dna here */}
      {!loading && extractedData &&
        <div className="extracted-brand-dna">
          <div className='flex-row gap-sm'>
            <h3>Extracted Brand DNA</h3>
            <div className='margin-auto-l iconBtn' onClick={clickSaveBtn} >
              <Heart className='icon' />
            </div>
          </div>
          <div className='brand-dna-item'>
            <span>Colors: </span>
            <div className=' color-list'>
              {extractedData.colors?.map((color, id) =>
                <div key={id} className='color' style={{ backgroundColor: color }}></div>
              )
              }
            </div>
          </div>
          <div className='brand-dna-item font'>
            <span>Font</span>
            <div className='sub-title'>
              {extractedData.fonts?.map((font, id) =>
                <div key={id}>
                  {font.startsWith("Error") ? "No fonts available" : font}

                  {id === 0 && !font.startsWith("Error") && "primary"}
                </div>
              )
              }
            </div>
          </div>

          <div className='brand-dna-item logo'>
            <span>Logo</span>
            {extractedData.logo_url ?
              <img src={extractedData.logo_url} className='logo-image' alt="logo" />
              :
              <div className='logo-image'>
              </div>
            }
          </div>
        </div>
      }
      {isOpen && <Modal isOpen={isOpen} closeModal={closeModal}>
        <div>
          <label htmlFor="font-0" className='label'>Font</label>
          <div className='flex-row gap-sm'>
            <input type="text" id="font-0"
              placeholder="Enter your brand name "
              value={brand}
              onChange={handleBrandChange}
              className='input-url' />
          </div>
          <Button onClick={saveBrand}>
            Save
          </Button>
        </div>
      </Modal>}
    {extractedData &&
        <div>
          <div className='brand-dna-item font'>
            <span>Fonts: </span>
            <div className='sub-title'>
              {extractedData.fonts?.map((font, id) => (
                <div key={id} style={{ fontFamily: font }}>
                  {font} {id === 0 && "(Primary)"}
                </div>
              ))}
            </div>
          </div>

          <div className='brand-dna-item logo'>
            <span>Logo: </span>
            {extractedData.logo_url ? (
              <img src={extractedData.logo_url} className='logo-image' alt="logo" />
            ) : (
              <div className='logo-image' style={{
                background: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999'
              }}>
                No logo detected
              </div>
            )}
          </div>

          {generateBrandPreview()}

          <Button
            className='margin-md brandify-btn'
            onClick={handleBrandify}
            disabled={isProcessing}
            style={{
              marginTop: 24,
              backgroundColor: extractedData.colors?.[0] || '#007bff',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              padding: '12px 24px'
            }}
          >
            {isProcessing ? 'Brandifying...' : 'Brandify Document'}
          </Button>
        </div>
    }

  </div>
  );
};

export default UploadAssetPage;
