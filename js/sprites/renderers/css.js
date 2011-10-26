define([ 'util/ensureCallback' ], function (ensureCallback) {
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

    function RenderContext(element, frameData) {
        this.elements = frameData[0].map(function () {
            var el = element.cloneNode(true);
            el.style.position = 'absolute';
            el.style.left = '0';
            el.style.top = '0';
            return el;
        });

        this.transformData = frameData.map(function (objectTransforms) {
            return objectTransforms.map(function (t) {
                return '' +
                    transformScalePrefix + t.scaleX + ',' + t.scaleY + transformScaleSuffix + ' ' +
                    transformTranslatePrefix + t.x + 'px,' + t.y + 'px' + transformTranslateSuffix + ' ' +
                    '';
            });
        });
    }

    RenderContext.prototype.load = function load(callback) {
        callback = ensureCallback(callback);

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
            elements[i].style[transformStyleProperty] = transforms[i];
        }
    };

    return function (element, frameData) {
        return new RenderContext(element, frameData);
    };
});
