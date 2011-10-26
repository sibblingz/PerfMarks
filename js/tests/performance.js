define([ 'tests/audioLatency' ], function (audioLatency) {
    return function performance(callback) {
        var totalResults = { };

        audioLatency(function (err, results) {
            if (err) {
                callback(err, totalResults);
                return;
            }

            totalResults.audioLatency = results;

            callback(null, totalResults);
        });
    };
});
