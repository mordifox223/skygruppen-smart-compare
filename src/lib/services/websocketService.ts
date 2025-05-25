
export const setupRealtimeUpdates = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socketUrl = `${protocol}//${window.location.host}/api/realtime`;

  try {
    const socket = new WebSocket(socketUrl);

    socket.addEventListener('open', () => {
      console.log('✅ WebSocket connection established');
    });

    socket.addEventListener('error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'PRODUCT_UPDATE') {
          console.log('📦 Product update received:', data);
          // Handle real-time updates
          window.dispatchEvent(new CustomEvent('productUpdate', { detail: data }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    socket.addEventListener('close', () => {
      console.log('🔌 WebSocket connection closed');
    });

    return () => {
      console.log('🚪 Closing WebSocket connection');
      socket.close();
    };
  } catch (error) {
    console.error('Failed to setup WebSocket connection:', error);
    return () => {}; // Return empty cleanup function
  }
};
