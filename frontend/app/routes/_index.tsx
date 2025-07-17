import type { Route } from "./+types/_index";
import { useEffect, useState } from "react"
import {
  Search,
  Upload,
  X,
  ExternalLink,
  ChevronDown,
  Undo,
  Redo,
  HelpCircle,
  ScalingIcon as Resize,
  Palette,
  Play,
  Square,
  Users,
  Languages,
  MoreHorizontal,
  Plus,
  CloudUpload,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import Header from "~/components/common/header";
import Sidebar from "~/components/common/sidebar";
import { ThemeProvider } from "~/components/themeContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Brand Style AI" },
    { name: "description", content: "Convert your brand into theme" },
  ];
}


export default function Homepage() {
  const [theme, setTheme] = useState("light");
  const [selectedTool, setSelectedTool] = useState("brandStyle");
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [brandPanelOpen, setBrandPanelOpen] = useState(false);
  useEffect(() => {
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
        { !brandPanelOpen && selectedTool === "audiostock" && (
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
        { searchPanelOpen && (
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


        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
         
          {/* Canvas Area */}
          <div className="flex-1 gap-3 bg-gray-100 p-8 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-xl h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center relative text-gray-500 cursor-pointer">
                <input type="file" className="absolute top-0 left-0 w-full h-full z-10 opacity-0" />
                <CloudUpload  className="w-20 h-20 mx-auto"/>
                <Button variant={'secondary'} className="mt-2 ">Upload Now</Button>
              </div>
            </div>
            <span className="font-xs text-gray-500">OR</span>
            <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-gray-500 cursor-pointer ">
                <input type="text" placeholder="Enter URL" className="focus:outline-none border-1 border-gray-400 py-2  px-4 rounded-sm" />
                <Button variant={'secondary'} className="mt-2 block ">Submit</Button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
    </ThemeProvider>
  )
}
