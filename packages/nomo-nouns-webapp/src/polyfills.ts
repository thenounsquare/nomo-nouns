// Vite bundler needs Node polyfills for ConnectKit

window.global = window.global ?? window;
window.process = window.process ?? { env: {} };

export {};
