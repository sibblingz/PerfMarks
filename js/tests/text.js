define([ 'util/ensureCallback' ], function (ensureCallback) {
    var ITERATION_COUNT = 1000;
    var texts = [ 'hello world', 'other text' ];
    var CANVAS_WIDTH = 640;
    var CANVAS_HEIGHT = 640;

    var fontFamilies = {
        sans: 'sans-serif',
        serif: 'serif',
        monospace: 'monospace'
    };

    var fontSizes = [ 8, 10, 12, 14, 16, 24 ];

    var stylePreparers = {
        outline: function (context) {
            context.strokeStyle = 'red';
        },

        fill: function (context) {
            context.fillStyle = 'green';
        },

        fillOutline: function (context) {
            context.strokeStyle = 'red';
            context.fillStyle = 'green';
        }
    };

    var styleExecutors = {
        outline: function (context, text) {
            context.strokeText(text, 0, 0);
        },

        fill: function (context, text) {
            context.fillText(text, 0, 0);
        },

        fillOutline: function (context, text) {
            context.fillText(text, 0, 0);
            context.strokeText(text, 0, 0);
        }
    };

    var styles = Object.keys(styleExecutors);

    function runTest(fontFamily, fontSize, style, callback) {
        callback = ensureCallback(callback);

        var canvas = document.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        var context = canvas.getContext('2d');
        context.font = fontSize + 'pt ' + fontFamily;
        context.textBaseline = 'top';
        context.textAlign = 'left';
        stylePreparers[style](context);

        var execute = styleExecutors[style];
        var startTime = Date.now();
        var i;
        for (i = 0; i < ITERATION_COUNT; ++i) {
            execute(context, texts[i % texts.length]);
        }
        var lapTime = Date.now();
        context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)[0];
        var endTime = Date.now();

        callback(null, {
            draw: lapTime - startTime,
            flush: endTime - lapTime,
            total: endTime - startTime
        });
    }

    // family => size => style => test
    var tests = { };
    Object.keys(fontFamilies).forEach(function (fontFamilyKey) {
        var fontFamily = fontFamilies[fontFamilyKey];

        var subTests = { };
        tests[fontFamilyKey] = subTests;
        fontSizes.forEach(function (fontSize) {
            var subSubTests = { };
            subTests[fontSize] = subSubTests;
            styles.forEach(function (style) {
                subSubTests[style] = function (callback) {
                    runTest(fontFamily, fontSize, style, callback);
                };
            });
        });
    });

    return tests;
});
