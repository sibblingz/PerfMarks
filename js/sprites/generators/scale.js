define([ 'sprites/Transform' ], function (Transform) {
    return function scale(frameIndex, objectIndex) {
        var scale = (Math.sin((objectIndex + frameIndex * objectIndex) / 100) / 2 + 1) * 0.4;
        var x = Math.cos(objectIndex) * 300 + 200;
        var y = Math.sin(objectIndex) * 300 + 200;

        return new Transform({
            x: x,
            y: y,
            scaleX: scale,
            scaleY: scale
        });
    };
});
