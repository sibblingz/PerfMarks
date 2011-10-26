(function () {
    var names = [
        'css',
        'cssWebkitMatrix',
        'canvasDrawImagePartial'
    ];

    var filenames = [ ];
    names.forEach(function (name) {
        filenames.push('sprites/renderers/' + name);
    });

    define(filenames, function (/* ... */) {
        var renderers = { };
        var values = arguments;
        names.forEach(function (name, i) {
            renderers[name] = values[i];
        });

        return renderers;
    });
}());
