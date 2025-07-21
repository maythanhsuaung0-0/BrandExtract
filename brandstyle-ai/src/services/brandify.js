// src/services/brandify.js

export async function handleBrandifyClick(extractedData) {
  // Get the proxy for the sandbox (document) API
  if (!window.addOnUISdk) {
    alert("Adobe Add-on SDK not initialized.");
    return;
  }
  // "documentSandbox" is the id used in the manifest for the documentSandbox entry
  const sandboxApi = await window.addOnUISdk.apiProxy("documentSandbox");

  // Call the exposed "brandify" method in code.js, passing the DNA
  return await sandboxApi.brandify({
    colors: extractedData.colors || [],
    fonts: extractedData.fonts || [],
    logoUrl: extractedData.logo_url || "",
  });
}
