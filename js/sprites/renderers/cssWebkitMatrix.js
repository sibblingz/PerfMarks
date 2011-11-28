define([ 'util/ensureCallback', 'sprites/renderers/DomContext', 'util/create', 'sprites/container' ], function (ensureCallback, DomContext, create, container) {
    var SUPPORTS_WEBKIT_MATRIX = typeof WebKitCSSMatrix === 'function';

    function RenderContext(sourceData, frameData) {
        if (!SUPPORTS_WEBKIT_MATRIX) {
            return;
        }

        DomContext.call(this, sourceData, frameData);

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

        this.containerElement = container();
    }

    RenderContext.prototype = create(DomContext.prototype);

    RenderContext.prototype.load = function load(callback) {
        callback = ensureCallback(callback);

        if (!SUPPORTS_WEBKIT_MATRIX) {
            callback(new Error('Not supported'));
            return;
        }

        document.body.appendChild(this.containerElement);

        callback(null);
    };

    RenderContext.prototype.unload = function unload() {
        this.containerElement.parentNode.removeChild(this.containerElement);
        DomContext.prototype.unload.call(this);
    };

    RenderContext.prototype.processElements = function processElements(elements, transforms) {
        var count = transforms.length;
        var i;
        for (i = 0; i < count; ++i) {
            var element = elements[i];
            element.style.WebkitTransform = transforms[i];
            element.zIndex = i;

            // Elements not in the DOM need to be added
            if (!element.parentNode) {
                this.containerElement.appendChild(element);
            }
        }
    };

    return function (element, frameData) {
        return new RenderContext(element, frameData);
    };
});
