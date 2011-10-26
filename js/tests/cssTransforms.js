define([ 'util/ensureCallback', 'util/chainAsync' ], function (ensureCallback, chainAsync) {
    // Feature detection based off of
    // http://andrew-hoyer.com/experiments/rain/
    // Public domain

    var style = document.createElement('div').style;

    function getStyleName(propertyNames) {
        return propertyNames.filter(function(name) {
            return name in style;
        }).shift();
    }

    var transformOriginStyleProperty = getStyleName([
        'transformOrigin',
        'WebkitTransformOrigin',
        'MozTransformOrigin',
        'msTransformOrigin',
        'OTransformOrigin'
    ]);

    var transformStyleProperty = getStyleName([
        'transform',
        'WebkitTransform',
        'MozTransform',
        'msTransform',
        'OTransform'
    ]);

    var supportsTransform3D = !!getStyleName([
        'perspectiveProperty',
        'WebkitPerspective',
        'MozPerspective',
        'msPerspective',
        'OPerspective'
    ]);

    var transformTranslatePrefix = supportsTransform3D ? 'translate3D(' : 'translate(';
    var transformTranslateSuffix = supportsTransform3D ? ',0)' : ')';

    var transformScalePrefix = supportsTransform3D ? 'scale3D(' : 'scale(';
    var transformScaleSuffix = supportsTransform3D ? ',1)' : ')';

    // Firefox has a bug where it requires 'px' for translate matrix
    // elements (where it should accept plain numbers).
    var matrixTranslateSuffix = transformStyleProperty === 'MozTransform' ? 'px' : '';

    var FRAME_COUNT = 100;
    var OBJECT_COUNT = 20;
    var SEGMENT_COUNT = 2;
    var transformFrames = (function () {
        var transformFrames = [ ];
        var i;
        for (i = 0; i < FRAME_COUNT; ++i) {
            var transforms = [ ];
            transformFrames.push(transforms);

            var j;
            for (j = 0; j < OBJECT_COUNT; ++j) {
                var transform;
                var segment = Math.floor(SEGMENT_COUNT * j / OBJECT_COUNT);
                switch (segment) {
                default:
                case 1:
                    // Scale only
                    var scale = (Math.sin((j + i * j) / FRAME_COUNT) / 2 + 1) * 0.4;
                    var x = Math.cos(j) * 300 + 200;
                    var y = Math.sin(j) * 300 + 200;
                    transform = '' +
                        transformTranslatePrefix + x + 'px,' + y + 'px' + transformTranslateSuffix + ' ' +
                        transformScalePrefix + scale + ',' + scale + transformScaleSuffix + ' ' +
                        '';
                    break;

                case 0:
                    // Translate only
                    var x = Math.cos(j / (OBJECT_COUNT / SEGMENT_COUNT) * Math.PI * 2 + i / FRAME_COUNT) * 300 + 200;
                    var y = Math.sin(j / (OBJECT_COUNT / SEGMENT_COUNT) * Math.PI * 2 + i / FRAME_COUNT) * 300 + 200;
                    transform = '' +
                        transformTranslatePrefix + x + 'px,' + y + 'px' + transformTranslateSuffix + ' ' +
                        '';
                    break;
                }

                transforms.push(transform);
            }
        }
        return transformFrames;
    }());

    function runTests(els, callback) {
        callback = ensureCallback(callback);

        if (els.length < OBJECT_COUNT) {
            throw new Error('Must have at least ' + OBJECT_COUNT + ' items to test');
        }

        var i;
        for (i = 0; i < OBJECT_COUNT; ++i) {
            var el = els[i];
            el.style.position = 'absolute';
            el.style.left = '0';
            el.style.top = '0';
            el.style[transformOriginStyleProperty] = (el.width / 2) + 'px ' + (el.height / 2) + 'px';
            document.body.appendChild(el);
        }

        var startTime = null;
        var domTime = 0;

        var currentFrame = 0;
        function frame() {
            if (currentFrame === FRAME_COUNT) {
                var endTime = Date.now();

                var i;
                for (i = 0; i < els.length; ++i) {
                    var el = els[i];
                    document.body.removeChild(el);
                }

                callback(null, endTime - startTime, domTime);
                return false;
            }

            var transforms = transformFrames[currentFrame];

            var domStartTime = Date.now();
            var i;
            for (i = 0; i < OBJECT_COUNT; ++i) {
                els[i].style[transformStyleProperty] = transforms[i];
            }
            var domEndTime = Date.now();
            domTime += domEndTime - domStartTime;

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

    return function cssTransforms(callback) {
        callback = ensureCallback(callback);

        var results = { };
        chainAsync(
            function (next) {
                makeImages(OBJECT_COUNT, 'assets/html5-logo.png', function (err, images) {
                    runTests(images, function (err, totalTime, domTime) {
                        if (err) return callback(err);

                        results.imageTime = totalTime;
                        results.imageDomTime = domTime;
                        next();
                    });
                });
            },
            function () {
                callback(null, results);
            }
        );
    };
});
