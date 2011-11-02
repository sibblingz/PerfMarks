define([ 'sprites/sources', 'sprites/generators', 'sprites/renderers', 'util/ensureCallback', 'util/chainAsync', 'util/benchAsync' ], function (sources, generators, renderers, ensureCallback, chainAsync, benchAsync) {
    var FRAME_COUNT = 100;

    var objectCounts = [ 0, 1, 5, 15, 30, 100 ];

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

            var jsTime = 0;

            function frame(i, next) {
                setTimeout(next, 0);

                var frame = i % FRAME_COUNT;
                var jsStartTime = Date.now();
                renderContext.renderFrame(frame);
                var jsEndTime = Date.now();
                jsTime += jsEndTime - jsStartTime;
            }

            function done(err, score) {
                renderContext.unload();

                callback(null, {
                    js: jsTime,
                    wallScore: score
                });
            }

            return benchAsync(1000, frame, done);
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
