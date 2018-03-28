/**
 * Check out https://googlechrome.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */
'use strict';
importScripts('./build/sw-toolbox.js');

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/main.js',
    './build/vendor.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json'
  ]
);

self.toolbox.options.cache = {
	name: 'packonmyback-cache'
};

const CACHE_VERSION = 19;

// dynamically cache any other local assets
self.toolbox.router.get('/(.*)', self.toolbox.cacheFirst, {
	origin: /fonts\.googleapis\.com$/
});
self.toolbox.router.get('assets/*', self.toolbox.cacheFirst);
self.toolbox.router.get('build/*', self.toolbox.fastest);
self.toolbox.router.get('/', self.toolbox.fastest);
self.toolbox.router.get('manifest.json', self.toolbox.fastest);
