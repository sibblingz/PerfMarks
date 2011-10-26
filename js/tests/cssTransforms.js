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

    // Firefox has a bug where it requires 'px' for translate matrix
    // elements (where it should accept plain numbers).
    var matrixTranslateSuffix = transformStyleProperty === 'MozTransform' ? 'px' : '';

    function runTests(els, callback) {
        callback = ensureCallback(callback);

        var i;
        for (i = 0; i < els.length; ++i) {
            var el = els[i];
            el.style.position = 'absolute';
            el.style.left = '0';
            el.style.top = '0';
            document.body.appendChild(el);
        }

        var startTime = null;

        var remainingFrames = 100;
        function frame() {
            --remainingFrames;
            if (remainingFrames <= 0) {
                var endTime = Date.now();

                var i;
                for (i = 0; i < els.length; ++i) {
                    var el = els[i];
                    document.body.removeChild(el);
                }

                callback(null, endTime - startTime);
                return false;
            }

            var i;
            for (i = 0; i < els.length; ++i) {
                var el = els[i];
                var x = Math.random() * 400;
                var y = Math.random() * 400;
                el.style[transformStyleProperty] = transformTranslatePrefix + x + 'px,' + y + 'px' + transformTranslateSuffix;
            }

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
                makeImages(100, 'assets/html5-logo.png', function (err, images) {
                    runTests(images, function (err, time) {
                        if (err) return callback(err);

                        results.imageTime = time;
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
