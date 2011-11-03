define([ 'tests/performance', 'testDom', 'testRunner', 'tables', 'util/report' ], function (performance, testDom, testRunner, tables, report) {
    function testDone(err, name, results) {
        var domId = name.replace(/[^a-z0-9]/gi, '-');
        testDom.endTest(domId, err, results);
    }

    function allTestsDone(err, results) {
        if (err) {
            console.error(err);
        }

        var reports = [
            report.csvByObject({
                userAgent: window.navigator.userAgent,
                language: window.navigator.language
            })
        ];

        Object.keys(performance).forEach(function (testName) {
            var layout = report.makeTableLayout(tables.performance[testName]);
            reports.push(report.csvByLayout(results[testName], layout, [ testName ]));
        });

        var allTestResultsEl = document.getElementById('all-test-results');
        allTestResultsEl.textContent = reports.join('\n\n');
    }

    registerOnLoad(function () {
        var table = report.tableTemplate('performance-sprites', report.makeTableLayout(tables.performance.sprites));
        var tablePlaceholder = document.getElementById('performance-sprites-placeholder');
        tablePlaceholder.parentNode.replaceChild(table, tablePlaceholder);

        table = report.tableTemplate('performance-text', report.makeTableLayout(tables.performance.text));
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
