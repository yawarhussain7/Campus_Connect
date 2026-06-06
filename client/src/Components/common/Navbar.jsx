import {Link} from 'react-router-dom';
const Navbar = () => (
  <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-slate-100 sticky top-0 z-50">
    <div className="text-2xl font-black text-blue-600">CUI Hub</div>
    <div className="space-x-6 hidden md:flex font-medium text-slate-600">
      <a href="#features" className="hover:text-blue-600">Features</a>
      <a href="#teachers" className="hover:text-blue-600">Top Teachers</a>
      <a href="#papers" className="hover:text-blue-600">Latest Papers</a>
    </div>
    <div className="space-x-3">
      <Link to="/auth" className="px-4 py-2 text-slate-600 font-semibold">Login</Link>
      <Link to="/auth" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
        Register
      </Link>
    </div>
  </nav>
);


export default Navbar;