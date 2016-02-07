Storage = class Storage {
    /**
     * Create a new storage object to track changes on.
     * @param area HTML5 Storage area
     * @param fallback {boolean} whether to allow for using cookies as fallback
     * @param fallbackDur {number} if defined, number of days to save cookie fallback for.  If undefined or false, will
     * be saved for the browser session.
     */
    constructor(area, namespace, fallback, fallbackDur) {
        // first we check if the are is usable.
        if (area) {
            try {
                // first things first, try to set something
                area.setItem(`${namespace}testingCanStore`,'testingCanStore');
                // if we can successfully retrieve it, than the storage area is golden.
                if (area.getItem(`${namespace}testingCanStore`) === 'testingCanStore'){
                    this.area = area;
                }
                // cleanup after our test.
                area.removeItem(`${namespace}testingCanStore`);
            } catch (e) {
            }
        }
        // if we simply won't be able to function, fail RIGHT NOW!
        // Note that this won't ever trigger in the default implementation as fallback is always true.
        // However users who wish to establish their own storage areas could put it to use.
        if (!this.area && !fallback) {
            throw new ReferenceError("Can't use provided storage area, and no fallback was permitted");
        }
        // the dependency map will hold all of the dependencies created by get calls.
        this._dependencyMap = new Map();
        // the keys array will hold all of the most currently set keys (including those retrieved by reload).
        // this is used in clear to remove them.
        this._valueMap = new Map();
        // here we set up the cookie fallback if so required.
        if (!this.area && fallback) {
            this.area = new CookieStore(fallback, fallbackDur);
        }
        // don't forget to save the naming space.
        this.namespace = namespace;
        // finally we set up the window focus listener.  This is what makes sure that the storage is
        // kept synchronized between tabs (for storage mechanisms which allow data to be shared
        // between tabs.
        $(window).focus(() => {
            this.reload();
        });
    }
    set(name, value) {
        let currentVal = this._valueMap.get(name);
        this.area.setItem(`${this.namespace}${name}`, value);
        if (currentVal !== value) {
            if (this._dependencyMap.has(name)) {
                this._dependencyMap.get(name).changed();
            }
        }
        this._valueMap.set(name, value);
    }
    get(name) {
        if (!this._dependencyMap.has(name)) {
            this._dependencyMap.set(name, new Tracker.Dependency());
        }
        this._dependencyMap.get(name).depend();
        return this.area.getItem(`${this.namespace}${name}`);
    }
    remove(name) {
        if (this.area.getItem(`${this.namespace}${name}`)) {
            this.area.removeItem(`${this.namespace}${name}`);
            if (this._dependencyMap.has(name)) {
                this._dependencyMap.get(name).changed();
            }
            this._valueMap.remove(name);
        }
    }
    clear() {
        for (let key of [...this._valueMap.keys]) {
            this.remove(key);
        }
    }
    reload() {
        for (let key of this._dependencyMap.keys()) {
            this.refresh(key);
        }
    }
    refresh(name) {
        let storedValue = this.area.getItem(`${this.namespace}${name}`);
        if (storedValue !== this._valueMap.get(name)) {
            this.set(name, storedValue);
        }
    }
};
Storage.Local = new Storage(localStorage, 'reactiveLocal', true, 15);
Storage.Session = new Storage(undefined, 'reactiveSession', true, false);