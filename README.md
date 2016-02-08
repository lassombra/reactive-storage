# reactive-storage [![Build Status](https://travis-ci.org/lassombra/reactive-storage.svg?branch=master)](https://travis-ci.org/lassombra/reactive-storage)
Reactive wrapper on cookies and HTML5 Storage API

##Features
- Reactive updates to/from cookies and local storage
- Works across multiple tabs
- Can be configured to fallback in the case of local storage being unavailable.
- Low overhead with fine grained depedency using Reactive-Dictionary

##Storage object has the following:
- Constructor takes an optional storage area (localStorage or sessionStorage), a boolean whether to allow cookie based fallback, and a expiration time in days for cookie based fallback.
- Local object which is a wrapper on local storage with a 15 day expiration when cookies fallback
- Session object which uses cookies to create a cross-tab session only storage

##Usage
`Storage.Local.set('parameterName',parameterValue);` Sets Local storage to hold onto parameterValue.  Anything which was watching for that parameterName will be notified.
`Storage.Local.get('parameterName');` Gets from Local storage parameter Value.  Sets up automatically Tracker.Dependency to monitor value
`Storage.Local.refresh();` Forces recheck of actual values in storage.  This is done automatically on application startup, and on window focus (for cross-tab support)

###Notes
Package has tests and is being used in production currently on at least 3 sites by me.  Bug reports and feature requests always welcome!

###License
Released under the MIT license.  Have fun, go nuts.  Please contribute back to this one if you have updates, forks are great and all but a consistent repository is nice too!
