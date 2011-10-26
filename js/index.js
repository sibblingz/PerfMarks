define([ 'tests/performance', 'testDom' ], function (performance, testDom) {
    var testNameToDomId = {
        audioLatency: 'audio-latency',
        cssTransforms: 'css-transforms'
    };

    function testDone(err, name, results) {
        if (!testNameToDomId.hasOwnProperty(name)) {
            console.warn('Unknown test name: ' + name);
            return;
        }
        var domId = testNameToDomId[name];

        testDom.endTest(domId, !err && results.pass, results);
    }

    function allTestsDone(err, results) {
        if (err) {
            console.error(err);
        }

        // Do nothing
    }

    performance(allTestsDone, testDone);
});
