import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface UserProfile {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

interface MiniKitContextType {
  isReady: boolean;
  user: UserProfile | null;
  context: any;
  isConnected: boolean;
  signIn: () => Promise<void>;
  shareScore: (score: number) => Promise<void>;
  addToApp: () => Promise<void>;
}

const MiniKitContext = createContext<MiniKitContextType | undefined>(undefined);

interface MiniKitProviderProps {
  children: ReactNode;
}

export function MiniKitProvider({ children }: MiniKitProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [context, setContext] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initMiniKit = async () => {
      console.log('🚀 Starting MiniKit initialization...');
      try {
        console.log('📡 Checking SDK availability...');
        if (!sdk) {
          throw new Error('SDK not available');
        }

        console.log('🔗 Getting context information...');
        // Get context information with timeout
        let contextData = null;
        try {
          const contextPromise = sdk.context;
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Context timeout')), 2000)
          );
          contextData = await Promise.race([contextPromise, timeoutPromise]);
          console.log('📊 Context data received:', contextData);
          setContext(contextData);

          // Check if user is already signed in
          if (contextData?.user) {
            console.log('👤 User found in context:', contextData.user);
            setUser({
              fid: contextData.user.fid,
              username: contextData.user.username,
              displayName: contextData.user.displayName,
              pfpUrl: contextData.user.pfpUrl
            });
            setIsConnected(true);
          }
        } catch (contextError) {
          console.warn('⏱️ Context not available (likely not in Farcaster):', contextError.message);
        }

        console.log('✅ Calling sdk.actions.ready()...');
        // Signal that the app is ready - this is critical even if context fails
        try {
          const readyPromise = sdk.actions.ready();
          const readyTimeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Ready timeout')), 3000)
          );
          await Promise.race([readyPromise, readyTimeoutPromise]);
          console.log('🎯 sdk.actions.ready() called successfully');
        } catch (readyError) {
          console.warn('⚠️ sdk.actions.ready() failed or timed out:', readyError.message);
          console.log('📱 App will continue without Farcaster integration');
        }
        
        setIsReady(true);
        console.log('🎉 MiniKit initialization completed');
      } catch (error) {
        console.error('❌ Failed to initialize MiniKit:', error);
        console.log('⚠️ Marking as ready despite initialization failure');
        setIsReady(true); // Still mark as ready even if initialization fails
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initMiniKit();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async () => {
    try {
      // Generate a simple nonce for sign in
      const nonce = Math.random().toString(36).substring(7);
      const result = await sdk.actions.signIn({ nonce });
      if (result && typeof result === 'object' && 'user' in result) {
        const user = result.user as any;
        setUser({
          fid: user.fid,
          username: user.username,
          displayName: user.displayName,
          pfpUrl: user.pfpUrl
        });
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const shareScore = async (score: number) => {
    try {
      await sdk.actions.composeCast({
        text: `🚀 Just scored ${score.toLocaleString()} points in Galaxiga Classic Space Shooter! Think you can beat my high score? 👾`,
        embeds: [window.location.origin]
      });
    } catch (error) {
      console.error('Failed to share score:', error);
    }
  };

  const addToApp = async () => {
    try {
      await sdk.actions.addMiniApp();
    } catch (error) {
      console.error('Failed to add to app:', error);
    }
  };

  const value: MiniKitContextType = {
    isReady,
    user,
    context,
    isConnected,
    signIn,
    shareScore,
    addToApp
  };

  return (
    <MiniKitContext.Provider value={value}>
      {children}
    </MiniKitContext.Provider>
  );
}

export function useMiniKit() {
  const context = useContext(MiniKitContext);
  if (context === undefined) {
    throw new Error('useMiniKit must be used within a MiniKitProvider');
  }
  return context;
}