define([ 'sprites/sources', 'sprites/generators', 'sprites/renderers', 'util/ensureCallback', 'util/chainAsync' ], function (sources, generators, renderers, ensureCallback, chainAsync) {
    var FRAME_COUNT = 100;

    var objectCounts = [ 1, 5, 15, 30, 100 ];

    function generateFrames(generator, frameCount, objectCount) {
        var frames = [ ];

        var i, j;
        for (i = 0; i < frameCount; ++i) {
            var frame = [ ];
            frames.push(frame);

            for (j = 0; j < objectCount; ++j) {
                frame.push(generator(i, j));
            }
        }

        return frames;
    }

    function runTest(sourceData, objectCount, generator, renderer, callback) {
        callback = ensureCallback(callback);

        var frames = generateFrames(generator, FRAME_COUNT, objectCount);
        var renderContext = renderer(sourceData, frames);

        renderContext.load(function (err) {
            if (err) return callback(err);

            var startTime = null;
            var jsTime = 0;

            var currentFrame = 0;
            function frame() {
                if (currentFrame === FRAME_COUNT) {
                    var endTime = Date.now();
                    renderContext.unload();
                    callback(null, {
                        total: endTime - startTime,
                        js: jsTime
                    });
                    return false;
                }

                var jsStartTime = Date.now();
                renderContext.renderFrame(currentFrame);
                var jsEndTime = Date.now();
                jsTime += jsEndTime - jsStartTime;

                ++currentFrame;
                return true;
            }

            var intervalId = setInterval(function () {
                if (startTime === null) {
                    startTime = Date.now();
                }

                var cont = frame();
                if (!cont) {
                    clearInterval(intervalId);
                }
            }, 0);
        });
    }

    // source => renderer => object count => generator => test
    var tests = { };

    Object.keys(sources).forEach(function (sourceName) {
        var source = sources[sourceName];

        var subTests = { };
        tests[sourceName] = subTests;

        Object.keys(renderers).forEach(function (rendererName) {
            var renderer = renderers[rendererName];

            var subSubTests = { };
            subTests[rendererName] = subSubTests;

            objectCounts.forEach(function (objectCount) {
                var subSubSubTests = { };
                subSubTests[objectCount] = subSubSubTests;

                Object.keys(generators).forEach(function (generatorName) {
                    var generator = generators[generatorName];

                    subSubSubTests[generatorName] = function (callback) {
                        source(function (err, sourceData) {
                            if (err) return callback(err);
                            runTest(sourceData, objectCount, generator, renderer, callback);
                        });
                    };
                });
            });
        });
    });

    return tests;
});
