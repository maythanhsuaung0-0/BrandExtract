// To support: system="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Theme } from "@swc-react/theme";
import React, { useState } from "react";
import { Tabs, Tab, TabPanel } from '@swc-react/tabs';
import "./App.css";
import UploadAssetPage from "./pages/upload-assets";
import SuggestionPage from "./pages/suggestion";

const App = ({ addOnUISdk }) => {


  return (
    // Please note that the below "<Theme>" component does not react to theme changes in Express.
    // You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
    <Theme system="express" scale="medium" color="light">
      <div>
        <Tabs selected="upload-assets">
          <Tab label="Upload Assets" value="upload-assets"></Tab>
          <Tab label="Suggestions" value="suggestion" id="suggestion"></Tab>
          <Tab label="settings" value="settings" id="settings"></Tab>
          <TabPanel value="upload-assets">

            <UploadAssetPage />
          </TabPanel>
          <TabPanel value="suggestion">
            <SuggestionPage />
          </TabPanel>
          <TabPanel value="settings">
            <p>Content for Settings tab goes here.</p>
          </TabPanel>
        </Tabs>
      </div>
    </Theme>
  );
};

export default App;
