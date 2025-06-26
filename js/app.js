if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('js/sw.js')
    .then(reg => console.log("SW registered", reg))
    .catch(err => console.error("SW registration failed", err));
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installBtn").style.display = "inline-block";
});

document.getElementById("installBtn").addEventListener("click", () => {
  deferredPrompt.prompt();
});