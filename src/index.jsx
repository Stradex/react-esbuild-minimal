import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <div>Hello, esbuild!</div>
    );
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);