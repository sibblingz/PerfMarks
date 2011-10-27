define([ 'util/ensureCallback', 'features', 'Modernizr' ], function (ensureCallback, features, Modernizr) {
    function RenderContext(element, frameData) {
        if (!Modernizr.csstransforms) {
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
                return '' +
                    'translate(' + t.x + 'px,' + t.y + 'px) ' +
                    'scale(' + t.scaleX + ',' + t.scaleY + ') ' +
                    '';
            });
        });
    }

    RenderContext.prototype.load = function load(callback) {
        callback = ensureCallback(callback);

        if (!Modernizr.csstransforms) {
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

    var transformStyleProperty = features.transformStyleProperty;

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
