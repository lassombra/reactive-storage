/**
 * Tests needed:
 * 1) Test that dependencies trigger.
 * 2) Test that data is stored, and can be retrieved.
 * 3) Test that deleting data does remove it completely.
 * 4) Test that creating new data to replace deleted data triggers depedency
 */
Tinytest.addAsync('Depedencies Trigger', (test, next) => {
  let autorunFired = false;
  Tracker.autorun((c) => {
    if (!c.firstRun) {
      autorunFired = true;
    }
    Storage.Local.get('test');
  });
  Storage.Local.set('test');
  Tracker.afterFlush(() => {
    test.isTrue(autorunFired);
    next();
  });
});

Tinytest.add('Can get data stored', test => {
  let dataToStore = '1337';
  Storage.Session.set('data',dataToStore);
  test.isEqual(dataToStore, Storage.Session.get('data'));
});

Tinytest.add('Can\'t retrieve deleted data', test => {
  Storage.Session.set('data', '1337');
  Storage.Session.delete('data');
  test.isUndefined(Storage.Session.get('data'));
});

Tinytest.addAsync('Depedencies stick around after deleting', (test, next) => {
  let autorunFired = false;
  Storage.Session.set('data', '1337');
  Tracker.autorun((c) => {
    if (!c.firstRun && Storage.Session.get('data')) {
      autorunFired = true;
    }
    Storage.Session.get('data');
  });
  Storage.Session.delete('data');
  Tracker.afterFlush(() => {
    Storage.Session.set('data', '1337');
    Tracker.afterFlush(() => {
      test.isTrue(autorunFired);
      next();
    });
  });
});