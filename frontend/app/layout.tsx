import React, { useState, useLayoutEffect } from 'react';
import Header from './components/common/header';
import Sidebar from './components/common/sidebar';
import { Button } from './components/ui/button';
import { Search, X } from 'lucide-react';
import { ThemeProvider } from './components/themeContext';
interface LayoutProps {
  children: React.ReactNode;
}
/**
 * Layout component for the application.
 * @param {LayoutProps} props - The component's props.
 */
function Layout({ children }: LayoutProps) {

  const [selectedTool, setSelectedTool] = useState("brandStyle");
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [brandPanelOpen, setBrandPanelOpen] = useState(false);
  useLayoutEffect(() => {
    console.log("Selected Tool:", selectedTool);
    switch (selectedTool) {
      case "brandStyle":
        setBrandPanelOpen(false);
        setSearchPanelOpen(false);
        break;
      case "search":
        setSearchPanelOpen(true);
        setBrandPanelOpen(false);
        break;
      default:
        setBrandPanelOpen(true);
        setSearchPanelOpen(false);
    }
  })
  const closeSidePanel = () => {
    setSelectedTool("");
    setBrandPanelOpen(true);
    setSearchPanelOpen(false);
  }
  const openSearchPanel = () => {
    setSearchPanelOpen(true);
    setBrandPanelOpen(false);
  }
  return (
  <ThemeProvider>
    <div className="h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar setSelectedTool={setSelectedTool}
        />
        {/* Audiostock Panel */}
        {!brandPanelOpen && selectedTool === "audiostock" && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Panel Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">Brand Style AI</span>
              </div>
              <Button className="cursor-pointer" onClick={closeSidePanel} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )
        }
        {searchPanelOpen && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Panel Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Search Bar */}
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search add-ons"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <Button className="cursor-pointer" onClick={closeSidePanel} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )
        }
        {children}

    </div>
    </div>
    </ThemeProvider>
  );
}
export default Layout;
