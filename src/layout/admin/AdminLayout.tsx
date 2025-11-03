import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayout() {
    return (
        <div className="flex h-screen bg-gray-900 w-screen fixed top-0 left-0">
            <input type="checkbox" id="menu-toggle" className="hidden peer" />
            
            <AdminSidebar />
            
            <div className="flex flex-col flex-1 overflow-y-auto">
                <AdminHeader />
                
                {/* Content Area - Similar to your Content component */}
                <div className="flex-1 overflow-y-auto bg-gray-900">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}