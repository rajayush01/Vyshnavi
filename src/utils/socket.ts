import { io } from 'socket.io-client';

// Make sure your .env has VITE_API_URL pointing to your backend (Render URL)
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  // cors: {
  //   origin: window.location.origin, // frontend origin
  // },

});
