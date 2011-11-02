define([ ], function () {
    var report = {
        csv: function csv(data, accept) {
            function serialize(text) {
                if (/"/.test(text)) {
                    return '"' + text.replace(/"/g, '""') + '"';
                } else {
                    return text;
                }
            }

            if (typeof accept !== 'function') {
                accept = function () { return true; };
            }

            var records = [ ];

            function write(object, stack) {
                if (object && typeof object.valueOf === 'function') {
                    object = object.valueOf();
                }

                if (object === null) {
                    return;
                }

                switch (typeof object) {
                case 'object':
                    Object.keys(object).forEach(function (key) {
                        if (accept(key)) {
                            write(object[key], stack.concat([ key ]));
                        }
                    });
                    break;

                case 'string':
                case 'number':
                case 'boolean':
                    records.push(stack.concat([ String(object) ]));
                    break;

                default:
                    throw new TypeError('Cannot serialize object ' + object);
                }
            }

            write(data, [ ]);

            return records.map(function (record) {
                return record.map(serialize).join(',');
            }).join('\n');
        }
    };

    return report;
});
