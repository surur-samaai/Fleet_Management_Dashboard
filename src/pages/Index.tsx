import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from '../context/AuthContext';

const Index = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    
    const userEmail = user?.email || 'N/A';
    const userName = userEmail.split('@')[0];

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar stays fixed on the left */}
            <Sidebar 
                onLogout={handleLogout} 
                userName={userName} 
                userEmail={userEmail} 
            />

            {/* Main content pushed to the right */}
            <main className="flex-1 overflow-auto ml-64 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Index;
