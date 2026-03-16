import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthProvider';
import { SettingsProvider } from './contexts/SettingsProvider';
import { UserProfileProvider } from './contexts/UserProfileProvider';
import { TasksProvider } from './contexts/TasksProvider';
import { NurtureProvider } from './contexts/NurtureProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <UserProfileProvider>
          <TasksProvider>
            <NurtureProvider>
              <App />
            </NurtureProvider>
          </TasksProvider>
        </UserProfileProvider>
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);