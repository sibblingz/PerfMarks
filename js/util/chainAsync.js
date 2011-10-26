define([ ], function () {
    return function chainAsync(/* functions */) {
        var functions = Array.prototype.slice.call(arguments);

        function next() {
            if (functions.length === 0) {
                return;
            }

            var fn = functions.shift();
            fn(function () {
                setTimeout(next, 0);
            });
        }

        setTimeout(next, 0);
    };
});
