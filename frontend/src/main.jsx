import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { SkillProvider } from './context/SkillContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SkillProvider>
      <App />
    </SkillProvider>
  </StrictMode>,
);
