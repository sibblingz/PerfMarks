define([ 'util/ensureCallback', 'features', 'Modernizr', 'sprites/renderers/DomContext', 'util/create' ], function (ensureCallback, features, Modernizr, DomContext, create) {
    function RenderContext(sourceData, frameData) {
        if (!Modernizr.csstransforms) {
            return;
        }

        DomContext.call(this, sourceData, frameData);

        this.elements.forEach(function (frameElements) {
            frameElements.forEach(function (element) {
                element.style[features.transformOriginStyleProperty] = '0 0';
            });
        });

        this.transformData = frameData.map(function (objectTransforms) {
            return objectTransforms.map(function (t) {
                return t.cssTransform2d;
            });
        });
    }

    RenderContext.prototype = create(DomContext.prototype);

    RenderContext.prototype.load = function load(callback) {
        callback = ensureCallback(callback);

        if (!Modernizr.csstransforms) {
            callback(new Error('Not supported'));
            return;
        }

        callback(null);
    };

    var transformStyleProperty = features.transformStyleProperty;
    var body = document.body;

    RenderContext.prototype.processElements = function processElements(elements, transforms) {
        var count = elements.length;
        var i;
        for (i = 0; i < count; ++i) {
            var element = elements[i];
            element.style[transformStyleProperty] = transforms[i];
            element.zIndex = i;

            // Elements not in the DOM need to be added
            if (!element.parentNode) {
                body.appendChild(element);
            }
        }
    };

    return function (element, frameData) {
        return new RenderContext(element, frameData);
    };
});
