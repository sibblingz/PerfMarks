define([ 'sprites/Transform' ], function (Transform) {
    return function scale(frameIndex, objectIndex) {
        var x = Math.cos((objectIndex + frameIndex * (objectIndex + 1)) / 100) * 300 + 200;
        var y = Math.sin((objectIndex + frameIndex * (objectIndex + 1)) / 100) * 300 + 200;

        return new Transform({
            x: x,
            y: y
        });
    };
});
