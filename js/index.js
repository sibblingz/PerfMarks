define([ 'tests/performance', 'testDom', 'testRunner' ], function (performance, testDom, testRunner) {
    function testDone(err, name, results) {
        var domId = name.replace(/[^a-z0-9]/gi, '-');
        testDom.endTest(domId, err, results);
    }

    function allTestsDone(err, results) {
        if (err) {
            console.error(err);
        }

        // Do nothing
    }

    testRunner.run('performance', performance, {
        done: allTestsDone,
        step: testDone
    });
});
