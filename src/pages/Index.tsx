import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from '../context/AuthContext';

const Index = () => {
    // 1. Get auth and navigation hooks
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // 2. Define the logout function to pass to the Sidebar
    const handleLogout = async () => {
        try {
            await logout(); // Ends the Firebase session
            navigate('/login'); // Redirects to the login page
        } catch (error) {
            console.error("Logout failed:", error);
            // Implement error display logic here (e.g., using toast)
        }
    };
    
    // 3. Prepare user details for the Sidebar footer
    // Defaults to 'N/A' if the user object is null
    const userEmail = user?.email || 'N/A';
    const userName = userEmail.split('@')[0];

    return (
        <div className="flex min-h-screen bg-background">
            {/* Pass the logout function and user data to the Sidebar */}
            <Sidebar 
                onLogout={handleLogout} 
                userName={userName} 
                userEmail={userEmail} 
            />
            {/* Main Content Area renders the current page (Dashboard, etc.) */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Index;
