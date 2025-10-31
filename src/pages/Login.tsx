import { useState, useEffect } from 'react';
import { LogIn, UserPlus, Menu, User, BookOpen, X, Edit3, Loader2, Truck } from 'lucide-react';
// These imports are required for the functional version:
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

// --- Reusable Component: ModalDialog (Mimics Shadcn Dialog/Modal) ---
// (No changes needed here, only cosmetic fixes for type clarity)
const ModalDialog = ({ title, children, isOpen, onClose }: { title: string, children: React.ReactNode, isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl transition-all duration-300 transform scale-100">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 transition-colors hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- Main Login Component ---
// Renamed from 'Auth' to 'Login' to match your file name
const Login = () => {
  // Real state for form inputs and error handling
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // REAL AUTHENTICATION HOOK
  const { user, login, logout, loading, signup } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is ALREADY logged in (e.g., if they manually go to /login)
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const openModal = (modalName: string) => {
    setError(null);
    setActiveModal(modalName);
  };
  const closeModal = () => setActiveModal(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setActiveModal('loading'); // Show spinner

    try {
      await login(loginEmail, loginPassword);
      // Success: Redirection is handled by the useEffect above
    } catch (err: any) {
      console.error("Login Error:", err);
      const message = err.message.replace('Firebase: Error (auth/', '').replace(/\)\.$/, '').replace(/-/g, ' ');
      setError(`Login failed: ${message}`);
      setActiveModal('login'); // Re-open login modal to show error
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setActiveModal('loading'); 

    try {
      await signup(signupEmail, signupPassword);
      // Success: Firebase will sign them in and the useEffect will redirect
    } catch (err: any) {
      console.error("Signup Error:", err);
      const message = err.message.replace('Firebase: Error (auth/', '').replace(/\)\.$/, '').replace(/-/g, ' ');
      setError(`Signup failed: ${message}`);
      setActiveModal('signup'); 
    }
  };

  // We can determine if the user is logged in by checking the real 'user' object
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR: Now using REAL 'user' state and 'logout' function */}
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          <a href="/" className="flex items-center space-x-3">
  <Truck className="h-7 w-7 text-indigo-600" />
  <span className="text-xl font-bold text-gray-900">FleetPro</span>
</a>


          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => openModal('account')} 
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition flex items-center gap-1"
                >
                  <User className="h-4 w-4" /> Account
                </button>
                <button 
                  onClick={() => openModal('create')} 
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition flex items-center gap-1"
                >
                  <Edit3 className="h-4 w-4" /> Create Guide
                </button>
                <button 
                  onClick={logout} // REAL LOGOUT FUNCTION
                  className="px-3 py-1.5 text-sm font-semibold text-white bg-red-500 rounded-full shadow-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => openModal('login')} 
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition flex items-center gap-1"
                >
                  <LogIn className="h-4 w-4" /> Login
                </button>
                <button 
                  onClick={() => openModal('signup')} 
                  className="px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-md hover:bg-indigo-700 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setActiveModal('menu')}
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </header>

      {/* Main Content Area: Guide List */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Guides</h1>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition">
                <h2 className="text-lg font-semibold text-gray-800">Guide Title {id}</h2>
                <span className="text-sm text-indigo-500">View Details &rarr;</span>
              </div>
              <div className="border-t p-4 text-gray-600">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed ante ac metus facilisis vulputate in quis ligula.</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- MODALS --- */}

      {/* Loading/Submit State Modal */}
      <ModalDialog isOpen={activeModal === 'loading'} title="Processing..." onClose={() => {}}>
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mr-2" />
          <p className="text-gray-600">Please wait while we process your request...</p>
        </div>
      </ModalDialog>

      {/* LOGIN MODAL */}
      <ModalDialog isOpen={activeModal === 'login'} title="Welcome Back" onClose={closeModal}>
        {error && <p className="text-red-500 text-sm mb-3 p-2 bg-red-100 rounded border border-red-200">{error}</p>}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input 
              type="email" 
              id="login-email" 
              required 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Your password</label>
            <input 
              type="password" 
              id="login-password" 
              required 
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
      </ModalDialog>

      {/* SIGN UP MODAL */}
      <ModalDialog isOpen={activeModal === 'signup'} title="Create Your Account" onClose={closeModal}>
        {error && <p className="text-red-500 text-sm mb-3 p-2 bg-red-100 rounded border border-red-200">{error}</p>}
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input 
              type="email" 
              id="signup-email" 
              required 
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Choose password</label>
            <input 
              type="password" 
              id="signup-password" 
              required 
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Sign up
          </button>
        </form>
      </ModalDialog>
      
      {/* ACCOUNT MODAL */}
      <ModalDialog isOpen={activeModal === 'account'} title="Account Details" onClose={closeModal}>
        <div className="space-y-3 text-center">
          <User className="h-12 w-12 text-indigo-500 mx-auto" />
          <p className="text-lg font-medium">{user?.email || 'N/A'}</p>
          <button 
            onClick={logout} // REAL LOGOUT FUNCTION
            className="w-full px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </ModalDialog>

      {/* CREATE GUIDE MODAL (Placeholder content) */}
      <ModalDialog isOpen={activeModal === 'create'} title="Create New Guide" onClose={closeModal}>
        <div className='p-4 text-center'>
            <p className="text-gray-600">The guide creation form goes here.</p>
            <p className="text-sm text-gray-500 mt-2">Current User ID: {user?.uid || 'Not Logged In'}</p>
        </div>
      </ModalDialog>
      
      {/* Mobile Menu Modal (implementation omitted for brevity) */}

    </div>
  );
};

export default Login;
