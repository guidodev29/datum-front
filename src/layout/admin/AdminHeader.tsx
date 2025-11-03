export function AdminHeader() {
    return (
        <div className="flex items-center justify-between h-16 py-4 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center px-6">
                <label htmlFor="menu-toggle" className="md:hidden mr-4 bg-slate-800 text-white p-2 rounded focus:outline-none cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </label>

                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-blue-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>
                        <h1 className="text-xl font-semibold text-slate-800">Admin Panel</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}