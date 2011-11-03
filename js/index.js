define([ 'tests/performance', 'testDom', 'testRunner', 'tables', 'util/report', 'util/ensureCallback' ], function (performance, testDom, testRunner, tables, report, ensureCallback) {
    var agentMetadata = {
        userAgent: window.navigator.userAgent,
        language: window.navigator.language
    };

    function testDone(err, name, results) {
        var domId = name.replace(/[^a-z0-9]/gi, '-');
        testDom.endTest(domId, err, results);
    }

    function allTestsDone(err, results) {
        if (err) {
            console.error(err);
        }

        var reports = [
            report.csvByObject(agentMetadata)
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
        var uploadPerformanceTestsButton = document.getElementById('upload-performance-tests');

        function setRunning(isRunning) {
            performanceTestsRunning = isRunning;
            runPerformanceTestsButton.disabled = isRunning;
            uploadPerformanceTestsButton.disabled = isRunning;
        }

        function runPerformanceTests(callback) {
            callback = ensureCallback(callback);

            testRunner.run('performance', performance, {
                done: function (err, results) {
                    allTestsDone(err, results);
                    callback(err, results);
                },
                step: testDone
            });
        }

        function runAndUploadPerformanceTests(callback) {
            callback = ensureCallback(callback);

            runPerformanceTests(function (err, results) {
                if (err) return callback(err);

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        // Complete
                        callback(null);
                    }
                };
                xhr.open('POST', 'results', true);
                xhr.send(JSON.stringify({
                    agentMetadata: agentMetadata,
                    results: results
                }));
            });
        }

        setRunning(false);

        runPerformanceTestsButton.addEventListener('click', function () {
            if (performanceTestsRunning) {
                throw new Error('Tests already running');
            }

            setRunning(true);

            runPerformanceTests(function (err, results) {
                setRunning(false);
            });
        }, false);

        uploadPerformanceTestsButton.addEventListener('click', function () {
            if (performanceTestsRunning) {
                throw new Error('Tests already running');
            }

            setRunning(true);

            runAndUploadPerformanceTests(function (err, results) {
                setRunning(false);
            });
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
