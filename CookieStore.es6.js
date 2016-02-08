/**
 * Generic implementation of a storage mechanism wrapped over cookies.  Accepts a duration for how long
 * to save cookies.  Falsey values indicate that cookies should cease to exist at the end of this browser
 * session.  Other values are interpreted as numbers and in days.
 * @type {CookieStore}
 */
CookieStore = class CookieStore {
    constructor(duration) {
        if (duration) {
            this.duration = duration;
        }
        // cache contents because sometimes cookie changes are slow to propogate.
        // We want to make sure that we have everything cached and that cookies exist
        // only to map data between tabs and between sessions if duration was set.
        this.storedMap = new Map();
    }
    getItem(name) {
        if (this.storedMap.has(name)){
            return this.storedMap.get(name);
        } else {
            let cookies = document.cookie.split('; ');
            let cookieParsed = cookies.map(cookie => {
                let pieces = cookie.split('=');
                let key = pieces.shift();
                let value = pieces.join('=');
                return {key, value};
            });
            let cookie = _.find(cookieParsed, cookie => cookie.key === name);
            if (cookie) {
                // cache it so that we don't have to go through this process again anytime soon.
                this.storedMap.set(name, cookie.value);
                return cookie.value;
            }
        }
    }
    setItem(name, value) {
        this.storedMap.set(name, value);
        let age;
        if (this.duration) {
            //max-age is specified in seconds.  This converts duration to seconds.
            age = `; max-age=${this.duration * 60 * 60 * 24}`;
        } else {
            age = '; expires=';
        }
        document.cookie = `${name}=${value}; path=/${age}`;
    }
    removeItem(name) {
        this.storedMap.set(name, undefined);
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    reload() {
        this.storedMap.clear();
    }
};