function Header() {
  return (
    <div className="flex items-center justify-between h-16 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center px-4">
        <label htmlFor="menu-toggle" className="md:hidden mr-4 bg-gray-800 text-white p-2 rounded focus:outline-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
            U
          </div>
          <span className="text-slate-800 font-semibold">Hola User</span>
        </div>
      </div>
    </div>
  );
}

export default Header;