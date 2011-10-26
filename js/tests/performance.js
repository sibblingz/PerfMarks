define([ 'tests/audioLatency', 'tests/sprites', 'util/ensureCallback', 'util/chainAsync' ], function (audioLatency, sprites, ensureCallback, chainAsync) {
    return function performance(callback, stepCallback) {
        callback = ensureCallback(callback);

        var totalResults = { };

        function fail(err) {
            callback(err, totalResults);
        }

        function step(name, results) {
            totalResults[name] = results;
            stepCallback(null, name, results);
        }

        chainAsync(
            function (next) {
                audioLatency(function (err, results) {
                    if (err) return fail(err);

                    step('audioLatency', results);
                    next();
                });
            },
            function (next) {
                sprites(function (err, results) {
                    if (err) return fail(err);

                    step('sprites', results);
                    next();
                });
            },
            function () {
                callback(null, totalResults);
            }
        );
    };
});
