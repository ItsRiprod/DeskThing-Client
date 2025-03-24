(function loadManifest() {
  // First set default values
  window.manifest = window.manifest || {};
  
  // Try to fetch dynamic manifest from server
  fetch('/manifest.json')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(dynamicManifest => {
      // Merge with any existing values
      console.log(dynamicManifest)
      window.manifest = { ...window.manifest, ...dynamicManifest };
      document.dispatchEvent(new Event('manifestLoaded'));
    })
    .catch(error => {
      console.log('Using default manifest: ', error);
      // If fetch fails, load the default manifest
      fetch('/manifest.default.json')
        .then(response => response.json())
        .then(defaultManifest => {
          window.manifest = { ...window.manifest, ...defaultManifest };
          document.dispatchEvent(new Event('manifestLoaded'));
        });
    });
})();