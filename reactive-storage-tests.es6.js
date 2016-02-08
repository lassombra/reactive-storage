/**
 * Tests needed:
 * 1) Test that dependencies trigger.
 * 2) Test that data is stored, and can be retrieved.
 * 3) Test that deleting data does remove it completely.
 * 4) Test that creating new data to replace deleted data triggers depedency
 */
Tinytest.addAsync('Depedencies Trigger', (test, next) => {
  let autorunFired = false;
  let autorun;
  Tracker.autorun((c) => {
    autorun = c;
    if (!c.firstRun) {
      autorunFired = true;
    }
    Storage.Local.get('test');
  });
  Storage.Local.set('test', '1337');
  Tracker.afterFlush(() => {
    test.isTrue(autorunFired);
    Storage.Local.clear();
    autorun.stop();
    next();
  });
});

Tinytest.add('Can get data stored', test => {
  let dataToStore = '1337';
  Storage.Session.set('data',dataToStore);
  test.isTrue(dataToStore === Storage.Session.get('data'));
  Storage.Session.clear();
});

Tinytest.add('Can\'t retrieve deleted data', test => {
  Storage.Session.set('data', '1337');
  Storage.Session.remove('data');
  test.isUndefined(Storage.Session.get('data'));
  Storage.Session.clear();
});

Tinytest.addAsync('Depedencies stick around after deleting', (test, next) => {
  let autorunFired = false;
  let autorun;
  Storage.Session.set('data', '1337');
  Tracker.autorun((c) => {
    autorun = c;
    if (!c.firstRun && Storage.Session.get('data')) {
      autorunFired = true;
    }
    Storage.Session.get('data');
  });
  Storage.Session.remove('data');
  Tracker.afterFlush(() => {
    Storage.Session.set('data', '1337');
    Tracker.afterFlush(() => {
      test.isTrue(autorunFired);
      Storage.Session.clear();
      autorun.stop();
      next();
    });
  });
});

Tinytest.add('Clear removes all data from storage that was set by this storage', test => {
  Storage.Session.set('data', '1331');
  Storage.Session.set('data2', '1337');
  Storage.Session.clear();
  test.isUndefined(Storage.Session.get('data'));
  test.isUndefined(Storage.Session.get('data2'));
  Storage.Session.clear();
});

Tinytest.add('Reload catches all changes', test => {
  Storage.Local.set('data', '1331');
  localStorage.setItem('reactiveLocaldata', '1337');
  Storage.Local.reload();
  test.isTrue(Storage.Local.get('data') === '1337');
  Storage.Local.clear();
});