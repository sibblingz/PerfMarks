define([ 'util/ensureCallback', 'util/requestAnimationFrame' ], function (ensureCallback, requestAnimationFrame) {
    // Benchmarks fn until maxTime ms has passed.  Returns an object:
    //
    // {
    //   "score" -- approximate number of operations performed in that time ('score')
    // }
    function benchAsync(maxTime, fn, callback) {
        if (typeof fn !== 'function') {
            throw new TypeError('Argument must be a function');
        }

        var startTime;

        function rafUpdate() {
            rafTimes.push(Date.now());
            requestAnimationFrame(rafUpdate);
        }
        
        var timeoutTimes = [ ];
        var rafTimes = [ ];
        
        function next() {
            fn(timeoutTimes.length, function () {
                var endTime = Date.now();
                timeoutTimes.push(endTime);

                if (endTime - startTime >= maxTime) {
                    var elapsed = endTime - startTime;
                    var timeoutScore = timeoutTimes.length / elapsed * maxTime;
                    var rafScore = rafTimes.length / elapsed * maxTime;
                    return callback(null, {
                        startTime: startTime,
                        timeoutScore: timeoutScore,
                        rafScore: rafScore,
                        score: requestAnimationFrame ? rafScore : timeoutScore,
                        elapsed: elapsed
                    });
                } else {
                    return next();
                }
            });
        }

        setTimeout(function () {
            startTime = Date.now();

            if (requestAnimationFrame) {
                requestAnimationFrame(rafUpdate);
            }

            next();
        }, 0);
    }

    return benchAsync;
});
