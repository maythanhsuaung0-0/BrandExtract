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
export default readFile
