/**
 * Creates a debug mode toggle button
 * @param isDebugMode Current debug mode state
 * @returns The created button element
 */
export function createDebugToggle(isDebugMode: boolean): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = 'debug-toggle';
  button.textContent = isDebugMode ? 'Debug: ON' : 'Debug: OFF';
  button.className = isDebugMode ? 'debug-on' : 'debug-off';
  button.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-family: monospace;
    cursor: pointer;
    z-index: 1000;
    border: none;
    background: ${isDebugMode ? '#4CAF50' : '#555'};
    color: white;
  `;
  
  button.addEventListener('click', () => {
    const url = new URL(window.location.href);
    if (isDebugMode) {
      // Turn debug off
      url.searchParams.delete('mode');
    } else {
      // Turn debug on
      url.searchParams.set('mode', 'debug');
    }
    window.location.href = url.toString();
  });
  
  return button;
}