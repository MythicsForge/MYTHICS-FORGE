import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const renderApp = (): boolean => {
  const container = document.getElementById('root');
  if (container) {
    // If we've already rendered, don't double render
    if ((container as any)._reactRoot) {
      return true;
    }
    const root = createRoot(container);
    (container as any)._reactRoot = root;
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log("🔥 Mythics Forge App mount transaction successful!");
    return true;
  }
  return false;
};

// Mount the applet immediately if root is available
if (!renderApp()) {
  console.warn("⚠️ Root port was not immediately accessible in the matrix. Establishing event hooks...");
  
  // Try on DOMContentLoaded
  const handleDOMContentLoaded = () => {
    if (renderApp()) {
      window.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
    }
  };
  window.addEventListener('DOMContentLoaded', handleDOMContentLoaded);

  // Establish a low-latency polling sweep to capture post-load dynamic shifts in layout
  const sweepInterval = setInterval(() => {
    if (renderApp()) {
      clearInterval(sweepInterval);
    }
  }, 25);

  // Self-terminate polling sweep after 6 seconds to optimize system resources
  setTimeout(() => {
    clearInterval(sweepInterval);
  }, 6000);
}

