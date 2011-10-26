define([ ], function () {
    function Transform(options) {
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;

        'x,y,scaleX,scaleY,rotation'.split(',').forEach(function (prop) {
            if (prop in options) {
                this[prop] = options[prop];
            }
        }, this);

        // Matrix <=> array index representation:
        // [ 0 1 2 ]
        // [ 3 4 5 ]
        // [ - - - ]
        var cos = Math.cos(this.rotation);
        var sin = Math.sin(this.rotation);
        this.matrix = [
            cos * this.scaleX, -sin, this.x,
            sin, cos * this.scaleY, this.y
        ];
    }

    return Transform;
});
