// To support: system="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import { Toaster } from "react-hot-toast";
// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Theme } from "@swc-react/theme";
import React, { useState } from "react";
import { Tabs, Tab, TabPanel, TabsOverflow } from '@swc-react/tabs';
import "./App.css";
import UploadAssetPage from "./pages/upload-assets";
import SuggestionPage from "./pages/suggestion";
import VideoTools from "./pages/video-tools";
import Templates from "./pages/templates";
import CreateBrand from "./pages/create-brand";
import SavedBrands from "./pages/saved-brands";
import { AuthProvider } from "./authContext";

const App = ({ addOnUISdk }) => {


  return (
    // Please note that the below "<Theme>" component does not react to theme changes in Express.
    // You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
    <Theme system="express" scale="medium" color="light">
      <AuthProvider>
        <div className="tabs">
          <TabsOverflow>
            <Tabs selected="upload-assets">
              <Tab label="Upload Assets" value="upload-assets"></Tab>
              <Tab label="Suggestions" value="suggestion" id="suggestion"></Tab>
              <Tab label="Brandify" value="create-brand" id="create-brand"></Tab>
              <Tab label="video" value="video" id="video"></Tab>
              <Tab label="templates" value="templates" id="templates"></Tab>
              <Tab label="Saved" value="saved" id="saved"></Tab>
              <TabPanel value="upload-assets">
                <UploadAssetPage />
              </TabPanel>
              <TabPanel value="suggestion">
                <SuggestionPage />
              </TabPanel>
              <TabPanel value="saved">
                <SavedBrands />
              </TabPanel>
              <TabPanel value="create-brand">
                <CreateBrand />
              </TabPanel>
              <TabPanel value="video">
                <VideoTools />
              </TabPanel>
              <TabPanel value="templates">
                <Templates />
              </TabPanel>

            </Tabs>
          </TabsOverflow>
        </div>
      </AuthProvider>
      <Toaster toastOptions={{
        // Define default options
        duration: 700,
        removeDelay: 1000,
      }} />

    </Theme>
  );
};

export default App;
