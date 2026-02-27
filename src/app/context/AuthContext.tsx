import React, { createContext, useContext, useState, useEffect } from 'react';

export type PlanType = 'free' | 'silver' | 'gold' | 'platinum';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: PlanType;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, name?: string) => Promise<void>;
  logout: () => void;
  updatePlan: (plan: PlanType) => void;
  isPowerMode: boolean;
  setPowerMode: (mode: boolean) => void;
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPowerMode, setIsPowerMode] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Simulate checking auth session
    const storedUser = localStorage.getItem('elgorax_user');
    const storedMode = localStorage.getItem('elgorax_power_mode');
    const storedOnboarding = localStorage.getItem('elgorax_onboarding');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedMode) {
      setIsPowerMode(storedMode === 'true');
    }
    if (storedOnboarding) {
      setHasSeenOnboarding(storedOnboarding === 'true');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, name: string = 'User') => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: 'user-1',
      name,
      email,
      plan: 'free'
    };
    
    setUser(newUser);
    localStorage.setItem('elgorax_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setHasSeenOnboarding(false); // Reset for demo purposes usually, but maybe keep? Let's reset for now to test flow easily
    localStorage.removeItem('elgorax_user');
    localStorage.removeItem('elgorax_onboarding');
  };

  const updatePlan = (plan: PlanType) => {
    if (user) {
      const updatedUser = { ...user, plan };
      setUser(updatedUser);
      localStorage.setItem('elgorax_user', JSON.stringify(updatedUser));
    }
  };

  const setPowerModeWrapper = (mode: boolean) => {
    setIsPowerMode(mode);
    localStorage.setItem('elgorax_power_mode', String(mode));
  };

  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
    localStorage.setItem('elgorax_onboarding', 'true');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updatePlan,
      isPowerMode,
      setPowerMode: setPowerModeWrapper,
      hasSeenOnboarding,
      completeOnboarding
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
