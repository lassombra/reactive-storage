Package.describe({
  name: 'lassombra:reactive-storage',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: 'Reactive wrapper around cookies and HTML5 Storage',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/lassombra/reactive-storage',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('tracker');
  api.use('jquery');
  api.use('underscore');
  api.addFiles('CookieStore.es6.js', 'client');
  api.addFiles('Storage.es6.js', 'client');
  api.export('Storage');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tracker');
  api.use('tinytest');
  api.use('lassombra:reactive-storage');
  // this is a client only application
  api.addFiles('reactive-storage-tests.es6.js', 'client');
});
