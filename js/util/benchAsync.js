define([ 'util/ensureCallback' ], function (ensureCallback) {
    // Benchmarks fn until maxTime ms has passed.  Returns approximate number
    // of operations performed in that time ('score').
    function benchAsync(maxTime, fn, callback) {
        if (typeof fn !== 'function') {
            throw new TypeError('Argument must be a function');
        }

        var operationCount = 0;
        var startTime;
        
        // var raf = window.requestAnimationFrame
        //     || window.webkitRequestAnimationFrame
        //     || window.mozRequestAnimationFrame
        //     || window.oRequestAnimationFrame
        //     || window.msRequestAnimationFrame;
        // raf(rafUpdate);
        // 
        // var rafTicks = 0;
        // function rafUpdate() {
        //     ++rafTicks;
        //     raf(rafUpdate);
        // }

        var rafTicks = 0;
        window.addEventListener('touchmove', function (event) {
            ++rafTicks;
            event.preventDefault();
        }, false);
        
        function next() {
            fn(operationCount, function () {
                ++operationCount;

                var endTime = Date.now();
                if (endTime - startTime >= maxTime) {
                    console.log(rafTicks);
                    var elapsed = endTime - startTime;
                    var score = operationCount / elapsed * maxTime;
                    return callback(null, score, elapsed);
                } else {
                    return next();
                }
            });
        }

        setTimeout(function () {
            startTime = Date.now();
            next();
        }, 0);
    }

    return benchAsync;
});
