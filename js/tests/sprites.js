define([ 'sprites/generators', 'sprites/renderers', 'util/ensureCallback', 'util/chainAsync' ], function (generators, renderers, ensureCallback, chainAsync) {
    var FRAME_COUNT = 100;
    var OBJECT_COUNT = 50;

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

    function makeImages(count, src, callback) {
        callback = ensureCallback(callback);

        var loadedCount = 0;
        var images = [ ];

        function imageLoaded() {
            ++loadedCount;
            if (loadedCount === count) {
                callback(null, images);
            }
        }

        var i;
        for (i = 0; i < count; ++i) {
            var image = new window.Image();
            images.push(image);

            image.onload = imageLoaded;
            image.src = src;
        }
    }

    function runDomTest(element, generator, renderer, callback) {
        callback = ensureCallback(callback);

        var frames = generateFrames(generator, FRAME_COUNT, OBJECT_COUNT);
        var renderContext = renderer(element, frames);

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
    }

    function runTestCombinations(generators, renderers, testCallback, callback) {
        callback = ensureCallback(callback);

        var combinations = [ ];
        Object.keys(generators).forEach(function (generatorName) {
            Object.keys(renderers).forEach(function (rendererName) {
                combinations.push([ generatorName, rendererName ]);
            });
        });

        var results = { };

        function next() {
            var combination = combinations.shift();
            if (!combination) {
                callback(null, results);
                return;
            }

            var combinationKey = combination[1] + '.' + combination[0];
            var generator = generators[combination[0]];
            var renderer = renderers[combination[1]];

            testCallback(generator, renderer, function (err, testResults) {
                if (err) return callback(err);

                results[combinationKey] = testResults;
                next();
            });
        }

        next();
    }

    return function cssTransforms(callback) {
        callback = ensureCallback(callback);

        function testRunner(tester /* extra args */) {
            var extraArgs = Array.prototype.slice.call(arguments, 1);
            return function (generator, renderer, callback) {
                var args = extraArgs.concat([ generator, renderer, callback ]);
                tester.apply(null, args);
            };
        }

        var results = { };
        chainAsync(
            function (next) {
                var img = new window.Image();
                img.onload = function () {
                    runTestCombinations(generators, renderers, testRunner(runDomTest, img), function (err, testResults) {
                        if (err) return callback(err);

                        results.image = testResults;
                        next();
                    });
                };
                img.src = 'assets/html5-logo.png';
            },
            function () {
                callback(null, results);
            }
        );
    };
});
