import { useState } from "react"
import {
  ChevronDown,
  Undo,
  Redo,
  HelpCircle,
  ScalingIcon as Resize,
  Sun,
  Moon,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { useTheme } from "../themeContext"


const Header = ()=> {
  const {theme,toggleTheme}= useTheme()
  return (
    <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="w-full h-10" />
          </div>
          <span className="text-lg font-semibold">BrandStyle AI</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {theme === "light" ? (
          <Button variant="ghost" size="sm" onClick={() => toggleTheme()}>
            <Moon className="w-4 h-4" />
          </Button>

        ) :
          <Button variant="ghost" size="sm" onClick={() =>toggleTheme() }>
            <Sun className="w-4 h-4" />
          </Button>
        }
        <Button variant="ghost" size="sm">
          <HelpCircle className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="text-white border-gray-600 bg-transparent">
          Download
        </Button>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          Share
        </Button>
        <Button variant="outline" size="sm" className="text-white border-gray-600 bg-transparent">
          Sign up to save
        </Button>
      </div>
    </div>

  )
}
export default Header;
