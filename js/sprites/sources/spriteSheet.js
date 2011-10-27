define([ 'util/ensureCallback' ], function (ensureCallback) {
    var IMAGE_SRC = 'assets/monstro-fada.png';

    var FRAME_WIDTH = 37;
    var FRAME_HEIGHT = 58;

    var FRAMES_HORIZ = 6;
    var FRAMES_VERT = 1;

    var TOTAL_FRAMES = FRAMES_HORIZ * FRAMES_VERT;

    function ImageSource(img) {
        this.img = img;

        var canvas = document.createElement('canvas');
        canvas.width = FRAME_WIDTH;
        canvas.height = FRAME_HEIGHT;

        var context = canvas.getContext('2d');
        context.globalCompositeOperation = 'copy';

        this.frameImages = [ ];
        var x, y;
        for (y = 0; y < FRAMES_VERT; ++y) {
            for (x = 0; x < FRAMES_HORIZ; ++x) {
                context.drawImage(
                    img,
                    x * FRAME_WIDTH, y * FRAME_HEIGHT,
                    FRAME_WIDTH, FRAME_HEIGHT,
                    0, 0,
                    FRAME_WIDTH, FRAME_HEIGHT
                );

                var frameImage = new window.Image();
                frameImage.src = canvas.toDataURL();
                this.frameImages.push(frameImage);
            }
        }
    }

    ImageSource.prototype.getImage = function getImage(frameIndex) {
        return this.frameImages[frameIndex % TOTAL_FRAMES];
    };

    ImageSource.prototype.drawToCanvas = function drawToCanvas(context, dx, dy, frameIndex) {
        // TODO Move these calculations to ctor
        frameIndex %= TOTAL_FRAMES;
        var x = frameIndex % FRAMES_HORIZ;
        var y = Math.floor(frameIndex / FRAMES_HORIZ);

        context.drawImage(
            this.img,
            x * FRAME_WIDTH, y * FRAME_HEIGHT,
            FRAME_WIDTH, FRAME_HEIGHT,
            dx, dy,
            FRAME_WIDTH, FRAME_HEIGHT
        );
    };

    return function spriteSheet(callback) {
        callback = ensureCallback(callback);

        var img = new window.Image();
        img.onload = function () {
            var imageSource = new ImageSource(img);
            callback(null, imageSource);
        };
        img.src = IMAGE_SRC;
    };
});
