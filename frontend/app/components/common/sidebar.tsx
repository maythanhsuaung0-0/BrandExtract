import React, { useState } from "react"
import {
  Search,
  Upload,
  ScalingIcon as Resize,
  Square,
} from "lucide-react"
import { useTheme } from "../themeContext"
interface SidebarProps {
  setSelectedTool: (tool: string) => void
}
const Sidebar = (props: SidebarProps)=> {
  const {theme, toggleTheme} = useTheme() 
  const sidebarItems = [
    { id: "search", icon: Search, label: "Search" },
    { id: "stuff", icon: Square, label: "Your stuff" },
    { id: "brands", icon: Square, label: "Brands" },
    { id: "upload", icon: Upload, label: "Upload" },
    { id: "templates", icon: Square, label: "Templates" },
    { id: "media", icon: Square, label: "Media" },
    { id: "text", icon: Square, label: "Text" },
    { id: "elements", icon: Square, label: "Elements" },
    { id: "charts", icon: Square, label: "Charts and grids" },
  ]

  return (
    <div className={`w-16 bg-gray-800 text-white flex flex-col items-center py-4 space-y-4`}>
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => props.setSelectedTool(item.id)}
          className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-700 text-xs"
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] text-center leading-tight">{item.label}</span>
        </button>
      ))}
    </div>

  )
}
export default Sidebar
