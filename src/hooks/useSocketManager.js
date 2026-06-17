import { useEffect } from 'react';
import { useAuth } from '@/context';
import socket from '@/lib/socket';

export function useSocketManager() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      return;
    }
    // Connect once; socket stays alive for the entire session.
    // We do NOT disconnect on cleanup — that would kill the socket on every
    // React Strict Mode double-invoke and on navigations within ClientLayout.
    socket.connect();
  }, [user?._id]);
}
