define([ 'tests/performance', 'testDom', 'testRunner', 'tables' ], function (performance, testDom, testRunner, tables) {
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

    registerOnLoad(function () {
        var table = testDom.buildTable('performance-sprites', tables.performance.sprites);
        var tablePlaceholder = document.getElementById('performance-sprites-placeholder');
        tablePlaceholder.parentNode.replaceChild(table, tablePlaceholder);

        table = testDom.buildTable('performance-text', tables.performance.text);
        tablePlaceholder = document.getElementById('performance-text-placeholder');
        tablePlaceholder.parentNode.replaceChild(table, tablePlaceholder);

        var performanceTestsRunning = false;

        var runPerformanceTestsButton = document.getElementById('start-performance-tests');
        runPerformanceTestsButton.disabled = false;

        function runPerformanceTests() {
            if (performanceTestsRunning) {
                return;
            }

            performanceTestsRunning = true;
            runPerformanceTestsButton.disabled = true;

            testRunner.run('performance', performance, {
                done: function (err, results) {
                    performanceTestsRunning = false;
                    runPerformanceTestsButton.disabled = false;

                    allTestsDone(err, results);
                },
                step: testDone
            });
        }

        runPerformanceTestsButton.addEventListener('click', function () {
            runPerformanceTests();
        }, false);

        var getVars = { };
        if (/^\?/.test(location.search)) {
            location.search.substr(1).split(/&/g).forEach(function (part) {
                var equalsIndex = part.indexOf('=');

                if (equalsIndex >= 0) {
                    getVars[part.substr(0, equalsIndex)] = part.substr(equalsIndex + 1);
                } else {
                    getVars[part] = true;
                }
            });
        }

        if ('auto' in getVars) {
            runPerformanceTests();
        }
    });
});
