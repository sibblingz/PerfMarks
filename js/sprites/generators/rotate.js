define([ 'sprites/Transform' ], function (Transform) {
    return function scale(frameIndex, objectIndex) {
        var s = Math.sin(objectIndex / 5);
        var rotation = (objectIndex * s / Math.abs(s) + frameIndex * s) * 0.1;
        var x = Math.cos(objectIndex) * 300 + 200;
        var y = Math.sin(objectIndex) * 300 + 200;

        return new Transform({
            x: x,
            y: y,
            rotation: rotation
        });
    };
});
