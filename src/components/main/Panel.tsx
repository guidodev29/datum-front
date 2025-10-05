import Content from "../../layout/Content"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"

export const Panel = () => {
  return (
    <div className="flex h-screen bg-gray-50 w-screen fixed top-0 left-0">
      <input type="checkbox" id="menu-toggle" className="hidden peer" />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header />
        <Content />
        
      </div>
    </div>
  )
}