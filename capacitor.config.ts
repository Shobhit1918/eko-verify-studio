
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fb2faecd601f4a28a87fa612155e69c3',
  appName: 'eko-verify-studio',
  webDir: 'dist',
  server: {
    url: "https://fb2faecd-601f-4a28-a87f-a612155e69c3.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false
    }
  }
};

export default config;
