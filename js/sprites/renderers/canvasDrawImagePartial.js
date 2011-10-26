define([ 'util/ensureCallback' ], function (ensureCallback) {
    function RenderContext(element, frameData) {
        this.element = element;
        this.frameData = frameData;

        this.canvas = document.createElement('canvas');
        this.canvas.width = 1024;
        this.canvas.height = 1024;

        this.context = this.canvas.getContext('2d');
        this.context.globalCompositeOperation = 'source-over';

        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';

        this.previousTransforms = null;
    }

    RenderContext.prototype.load = function load(callback) {
        callback = ensureCallback(callback);

        document.body.appendChild(this.canvas);

        callback(null);
    };

    RenderContext.prototype.unload = function unload() {
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    };

    RenderContext.prototype.renderFrame = function renderFrame(frameIndex) {
        var transforms = this.frameData[frameIndex];
        var previousTransforms = this.previousTransforms;

        var context = this.context;
        var element = this.element;
        var width = element.width;
        var height = element.height;

        var count = transforms.length;

        var i, m;
        if (previousTransforms !== null) {
            for (i = 0; i < count; ++i) {
                m = previousTransforms[i].matrix;
                context.setTransform(m[0], m[1], m[3], m[4], m[2], m[5]);
                context.clearRect(0, 0, width, height);
            }
        }

        for (i = 0; i < count; ++i) {
            m = transforms[i].matrix;
            context.setTransform(m[0], m[1], m[3], m[4], m[2], m[5]);
            context.drawImage(element, 0, 0);
        }

        this.previousTransforms = transforms;
    };

    return function (element, frameData) {
        return new RenderContext(element, frameData);
    };
});
