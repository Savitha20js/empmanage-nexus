
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define user roles
export type UserRole = 'admin' | 'employee';

// Define user interface
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

// Mock users for demonstration
const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' as UserRole },
  { id: 2, name: 'John Employee', email: 'john@example.com', password: 'employee123', role: 'employee' as UserRole },
];

// Auth context interface
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
  isAuthenticated: false,
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user with matching credentials
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      // Create user object without password
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      
      // Store in local storage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Log activity (in a real app, this would be stored in the database)
      const activity = {
        userId: foundUser.id,
        timestamp: new Date().toISOString(),
        action: 'login',
      };
      console.log('Login activity:', activity);
      
      // Show success toast
      toast.success(`Welcome back, ${foundUser.name}!`);
      setIsLoading(false);
      return true;
    } else {
      toast.error('Invalid credentials. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Log activity before removing user
    if (user) {
      const activity = {
        userId: user.id,
        timestamp: new Date().toISOString(),
        action: 'logout',
      };
      console.log('Logout activity:', activity);
    }
    
    // Clear user data
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Value object to be provided to consumers
  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
