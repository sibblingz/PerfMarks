define([ 'util/ensureCallback', 'features', 'Modernizr', 'sprites/renderers/DomContext' ], function (ensureCallback, features, Modernizr, DomContext) {
    function RenderContext(sourceData, frameData) {
        if (!Modernizr.csstransforms3d) {
            return;
        }

        DomContext.call(this, sourceData, frameData);

        this.transformData = frameData.map(function (objectTransforms) {
            return objectTransforms.map(function (t) {
                return '' +
                    'translate3D(' + t.x + 'px,' + t.y + 'px,0px) ' +
                    'scale3D(' + t.scaleX + ',' + t.scaleY + ',1) ' +
                    '';
            });
        });
    }

    RenderContext.prototype = Object.create(DomContext.prototype);

    RenderContext.prototype.load = function load(callback) {
        callback = ensureCallback(callback);

        if (!Modernizr.csstransforms3d) {
            callback(new Error('Not supported'));
            return;
        }

        callback(null);
    };

    var transformStyleProperty = features.transformStyleProperty;
    var body = document.body;

    RenderContext.prototype.processElements = function processElements(elements, transforms) {
        var count = transforms.length;
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
