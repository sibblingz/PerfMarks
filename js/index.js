define([ 'tests/performance' ], function (performance) {
    performance(function (err, results) {
        if (err) {
            console.error(err);
            return;
        }

        console.log(JSON.stringify(results));
    });
});
