define([ 'sprites/generators', 'sprites/renderers', 'util/ensureCallback', 'util/chainAsync' ], function (generators, renderers, ensureCallback, chainAsync) {
    var FRAME_COUNT = 10;
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

    function runDomTest(element, generator, renderer, callback) {
        callback = ensureCallback(callback);

        var frames = generateFrames(generator, FRAME_COUNT, OBJECT_COUNT);
        var renderContext = renderer(element, frames);

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

    function makeImageTests(src) {
        function getImage(callback) {
            callback = ensureCallback(callback);

            var img = new window.Image();
            img.onload = function () {
                callback(null, img);
            };
            img.src = src;
        }

        // generator => renderer => test
        var tests = { };
        Object.keys(generators).forEach(function (generatorName) {
            var generator = generators[generatorName];

            var subTests = { };
            tests[generatorName] = subTests;
            Object.keys(renderers).forEach(function (rendererName) {
                var renderer = renderers[rendererName];

                subTests[rendererName] = function (callback) {
                    getImage(function (err, image) {
                        if (err) return callback(err);
                        runDomTest(image, generator, renderer, callback);
                    });
                };
            });
        });

        return tests;
    }

    return {
        image: makeImageTests('assets/html5-logo.png')
    };
});
