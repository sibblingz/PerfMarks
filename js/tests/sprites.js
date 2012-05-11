define([ 'sprites/sources', 'sprites/transformers', 'sprites/renderers', 'util/ensureCallback', 'util/chainAsync', 'util/benchAsync' ], function (sources, transformers, renderers, ensureCallback, chainAsync, benchAsync) {
    var FRAME_COUNT = 100;
    var TARGET_FRAMERATE = 30;

    function generateFrames(transformer, frameCount, objectCount) {
        var frames = [ ];

        var i, j;
        for (i = 0; i < frameCount; ++i) {
            var frame = [ ];
            frames.push(frame);

            for (j = 0; j < objectCount; ++j) {
                frame.push(transformer(i, j));
            }
        }

        return frames;
    }

    function runTest(sourceData, objectCount, transformer, renderer, callback) {
        callback = ensureCallback(callback);

        var frames = generateFrames(transformer, FRAME_COUNT, objectCount);
        var renderContext = renderer(sourceData, frames);

        renderContext.load(function (err) {
            if (err) return callback(err);

            var jsTime = 0;

            function frame(i, next) {
                setTimeout(next, 0);

                var frame = i % FRAME_COUNT;
                var jsStartTime = Date.now();
                renderContext.renderFrame(frame);
                var jsEndTime = Date.now();
                jsTime += jsEndTime - jsStartTime;
            }

            function done(err, results) {
                renderContext.unload();

                callback(null, {
                    js: jsTime,
                    fps: results.score,
                    raw: results
                });
            }

            // We must run the tests twice
            // due to Android CSS background loading bugs.
            benchAsync(1000, frame, function (err, _) {
                if (typeof renderContext.clear === 'function') {
                    renderContext.clear();
                }

                benchAsync(1000, frame, done);
            });
        });
    }

    function runTestToFramerate(targetFramerate, sourceData, transformer, renderer, callback) {
        callback = ensureCallback(callback);

        // objectCount => { js, fps }
        var fpsResults = { };

        // (objectCount, { js, fps })
        var rawData = [ ];

        function done() {
            var mostObjectsAboveThirtyFPS = -1;
            var minObjectsBelowThirtyFPS = -1;
            for (var i = 0; i < rawData.length; i++) {
                var temp = rawData[i];
                if (temp[1].fps > 30) {
                    if (mostObjectsAboveThirtyFPS === -1 || temp[0] > rawData[mostObjectsAboveThirtyFPS][0]) {
                        mostObjectsAboveThirtyFPS = i;
                    }
                } else {
                    if (minObjectsBelowThirtyFPS === -1 || temp[0] < rawData[minObjectsBelowThirtyFPS][0]) {
                        minObjectsBelowThirtyFPS = i;
                    }
                }
            }

            if (mostObjectsAboveThirtyFPS === -1 || minObjectsBelowThirtyFPS === -1) {
                callback(new Error("Bad test results"));
                return;
            }

            var aboveData = rawData[mostObjectsAboveThirtyFPS];
            var belowData = rawData[minObjectsBelowThirtyFPS];

            var m = (aboveData[0] - belowData[0]) / (aboveData[1].fps - belowData[1].fps);
            var objectCount = belowData[0] + m * (30 - belowData[1].fps);

            m = (aboveData[1].js - belowData[1].js) / (aboveData[1].fps - belowData[1].fps);
            var jsTime = belowData[1].js + m * (30 - belowData[1].fps);

            callback(null, {
                objectCount: objectCount,
                js: jsTime,
                rawData: rawData
            });
        }

        function test(objectCount) {
            if (Object.prototype.hasOwnProperty.call(fpsResults, objectCount)) {
                // Already tested; let's say we're done here
                done();
                return;
            }

            runTest(sourceData, objectCount, transformer, renderer, function testDone(err, results) {
                if (err) return callback(err);

                fpsResults[objectCount] = results;
                rawData.push([ objectCount, results ]);
                
                var timePerObjectEstimate = 1/(objectCount*results.fps);
                var estimatedMaxObjects = Math.floor(1/(targetFramerate * timePerObjectEstimate));
                
                test(estimatedMaxObjects);
            });
        }

        test(10);
    }

    // source => renderer => transformer => test
    var tests = { };

    Object.keys(sources).forEach(function (sourceName) {
        var source = sources[sourceName];

        var subTests = { };
        tests[sourceName] = subTests;

        Object.keys(renderers).forEach(function (rendererName) {
            var renderer = renderers[rendererName];

            var subSubTests = { };
            subTests[rendererName] = subSubTests;

            Object.keys(transformers).forEach(function (transformerName) {
                var transformer = transformers[transformerName];

                subSubTests[transformerName] = function spriteTest(callback) {
                    source(function (err, sourceData) {
                        if (err) return callback(err);
                        runTestToFramerate(TARGET_FRAMERATE, sourceData, transformer, renderer, callback);
                    });
                };
            });
        });
    });

    return tests;
});
