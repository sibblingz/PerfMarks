define([ 'tests/performance' ], function (performance) {
    performance(function (err, results) {
        if (err) {
            console.error(err);
            return;
        }

    }, function (err, name, results) {
        if (err) {
            console.error(err);
            return;
        }

        console.log(name, results);
    });
});
