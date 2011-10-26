define([ 'util/ensureCallback' ], function (ensureCallback) {
    var SUPPORTS_WEBKIT_MATRIX = typeof WebKitCSSMatrix === 'function';

    function RenderContext(element, frameData) {
        if (!SUPPORTS_WEBKIT_MATRIX) {
            return;
        }

        this.elements = frameData[0].map(function () {
            var el = element.cloneNode(true);
            el.style.position = 'absolute';
            el.style.left = '0';
            el.style.top = '0';
            return el;
        });

        this.transformData = frameData.map(function (objectTransforms) {
            return objectTransforms.map(function (t) {
                var m = new WebKitCSSMatrix();
                m.a = t.matrix[0];
                m.b = t.matrix[1];
                m.c = t.matrix[3];
                m.d = t.matrix[4];
                m.e = t.matrix[2];
                m.f = t.matrix[5];
                return m;
            });
        });
    }

    RenderContext.prototype.load = function load(callback) {
        callback = ensureCallback(callback);

        if (!SUPPORTS_WEBKIT_MATRIX) {
            callback(new Error('Not supported'));
            return;
        }

        this.elements.forEach(function (el) {
            document.body.appendChild(el);
        });

        callback(null);
    };

    RenderContext.prototype.unload = function unload() {
        this.elements.forEach(function (el) {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    };

    RenderContext.prototype.renderFrame = function renderFrame(frameIndex) {
        var transforms = this.transformData[frameIndex];
        var elements = this.elements;
        var count = transforms.length;

        var i;
        for (i = 0; i < count; ++i) {
            elements[i].style.WebkitTransform = transforms[i];
        }
    };

    return function (element, frameData) {
        return new RenderContext(element, frameData);
    };
});
