define([ 'util/ensureCallback', 'features', 'Modernizr', 'sprites/renderers/DomContext', 'util/create', 'sprites/container' ], function (ensureCallback, features, Modernizr, DomContext, create, container) {
    function RenderContext(sourceData, frameData) {
        if (!Modernizr.csstransforms3d) {
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
                return t.cssTransform3d;
            });
        });

        this.containerElement = container();
    }

    RenderContext.prototype = create(DomContext.prototype);

    RenderContext.prototype.load = function load(callback) {
        callback = ensureCallback(callback);

        if (!Modernizr.csstransforms3d) {
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

    var transformStyleProperty = features.transformStyleProperty;

    RenderContext.prototype.processElements = function processElements(elements, transforms) {
        var count = transforms.length;
        var i;
        for (i = 0; i < count; ++i) {
            var element = elements[i];
            element.style[transformStyleProperty] = transforms[i];
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
