define([ ], function () {
    function canvas() {
        var canvas = document.createElement('canvas');
        canvas.width = 768;
        canvas.height = 768;
        canvas.style.background = '#FFFFFF';
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        return canvas;
    }

    return canvas;
});
