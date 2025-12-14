// Configuration for the Call Break app

export const config = {
  // Server URL - change this based on your environment
  // For development with physical device, use your computer's local IP
  // Example: 'http://192.168.1.100:3000'
  serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
  
  // Game settings
  minPlayers: 2,
  maxPlayers: 12,
  
  // Network settings
  connectionTimeout: 10000, // 10 seconds
};

export default config;
