import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function Content() {
    return (
        <div>
        <div className="p-6 bg-gray-50 min-h-full">
            <Outlet />
        </div>
        {/* <Footer /> */}
        </div>
    );
}

export default Content;