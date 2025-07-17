import type { Route } from "./+types/_index";
import { useEffect, useRef, useState } from "react"
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
import Layout from "~/layout";
import { cn } from "~/lib/utils";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Brand Style AI" },
    { name: "description", content: "Convert your brand into theme" },
  ];
}


export default function Homepage() {
  const [theme, setTheme] = useState("light")
  const [file, setFile] = useState<FileList | null>()
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    // Handle file drop logic here
    const files = e.dataTransfer.files;
    setFile(files)
    console.log("Files dropped:", files);

  }
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const files = e.target.files;
    setFile(files)
    console.log(files)
  }
  return (
    <Layout>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">

        {/* Canvas Area */}
        <div className="flex-1 gap-3 bg-gray-100 p-8 flex items-center justify-center">
          {/*file upload and URL input*/}
          <div onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            ref={dropZoneRef} className={cn("bg-white rounded-lg shadow-sm p-8 w-full max-w-xl h-96 flex items-center justify-center border-2 border-dashed", isDragging ? "border-blue-500" : "border-gray-300")}>
            <div className="text-center relative text-gray-500 cursor-pointer">
              <input type="file" onChange={handleFileInput} className="absolute top-0 left-0 w-full h-full z-10 opacity-0" />
              <CloudUpload className="w-20 h-20 mx-auto" />
              <div>
                <Button variant={'secondary'} className="mt-2 ">Upload Now</Button>
                <span className="block text-xs mt-2">OR</span>
                <div>Drag your files and drop here</div>
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-500">OR</span>
          <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-gray-500 cursor-pointer ">
              <input type="text" placeholder="Enter URL" className="focus:outline-none border-1 border-gray-400 py-2  px-4 rounded-sm" />
              <Button variant={'secondary'} className="mt-2 block ">Submit</Button>
            </div>
          </div>

        </div>

      </div>
    </Layout>
  )
}
