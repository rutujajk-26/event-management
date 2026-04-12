import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Page, Event, Booking, User } from '../types';

interface AppContextType {
  currentPage: Page;
  navigate: (page: Page) => void;
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  bookingDetails: Booking | null;
  setBookingDetails: (booking: Booking | null) => void;
  user: User | null;
  authLoading: boolean;
  loginRole: 'admin' | 'student' | null;
  setLoginRole: (role: 'admin' | 'student' | null) => void;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function mapSupabaseUser(user: any): User {
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  return {
    id: user.id,
    email: user.email,
    full_name: String(metadata.full_name ?? ''),
    role: metadata.role === 'admin' ? 'admin' : 'student',
    college_id: String(metadata.college_id ?? ''),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loginRole, setLoginRole] = useState<'admin' | 'student' | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      const { data } = await supabase.auth.getUser();
      if (mounted && data?.user) {
        setUser(mapSupabaseUser(data.user));
      }
      setAuthLoading(false);
    }

    initializeAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const navigate = (page: Page) => {
    if (page !== 'login') {
      setLoginRole(null);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        selectedEvent,
        setSelectedEvent,
        bookingDetails,
        setBookingDetails,
        user,
        authLoading,
        loginRole,
        setLoginRole,
        signOut,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
