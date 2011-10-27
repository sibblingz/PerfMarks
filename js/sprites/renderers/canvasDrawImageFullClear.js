define([ 'util/ensureCallback' ], function (ensureCallback) {
    // FIXME Transforms not identical to CSS tests

    function RenderContext(sourceData, frameData) {
        this.sourceData = sourceData;
        this.frameData = frameData;

        this.canvas = document.createElement('canvas');
        this.canvas.width = 1024;
        this.canvas.height = 1024;

        this.context = this.canvas.getContext('2d');
        this.context.globalCompositeOperation = 'source-over';

        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';
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
        var sourceData = this.sourceData;

        var count = transforms.length;

        // Reset view and transforms
        context.canvas.width = context.canvas.width;

        for (i = 0; i < count; ++i) {
            var m = transforms[i].matrix;
            context.setTransform(m[0], m[1], m[3], m[4], m[2], m[5]);
            var img = sourceData.getImage(frameIndex);
            context.translate(-img.width / 2, -img.height / 2);
            context.drawImage(img, 0, 0);
        }

        this.previousTransforms = transforms;
    };

    return function (element, frameData) {
        return new RenderContext(element, frameData);
    };
});
