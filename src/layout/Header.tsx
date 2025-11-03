function Header() {
  return (
    <div className="flex items-center justify-between h-16 py-4 bg-white border-b border-gray-200">
      {/* Left side - Menu button */}
      <div className="flex items-center px-4">
        <label htmlFor="menu-toggle" className="md:hidden bg-gray-800 text-white p-2 rounded focus:outline-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
      </div>

      {/* Right side - User profile */}
      <div className="flex items-center px-4 space-x-4">
        {/* User profile */}
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
            U
          </div>
          <span className="hidden sm:inline text-slate-800 font-semibold">Hola User</span>
        </div>
      </div>
    </div>
  );
}

export default Header;