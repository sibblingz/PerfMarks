define([ 'util/report' ], function (report) {
    function classes(el) {
        return el.className.split(/\s+/g);
    }

    function addClass(el, className) {
        el.className += ' ' + className;
    }

    function removeClass(el, className) {
        // wtb classList (damnit Safari!)
        el.className = classes(el).filter(function (c) {
            return c !== className;
        }).join(' ');
    }

    function th(text) {
        var th = document.createElement('th');
        th.textContent = text;
        return th;
    }

    function td(text) {
        var td = document.createElement('td');
        td.textContent = text;
        return td;
    }

    function tr(cells) {
        var tr = document.createElement('tr');
        cells.forEach(function (cell) {
            tr.appendChild(cell);
        });
        return tr;
    }

    function testResultNameAccept(name) {
        return name !== 'pass';
    }

    var testDom = {
        endTest: function (domId, err, results) {
            var el = document.getElementById(domId);
            if (!el) {
                throw new Error('Could not find element #' + domId);
            }

            function findSlot(name) {
                var elements = el.querySelectorAll('[data-property]');
                var i;
                for (i = 0; i < elements.length; ++i) {
                    var element = elements[i];
                    if (element.getAttribute('data-property') === name) {
                        return element;
                    }
                }

                return null;
            }

            function fillSlots(name, value) {
                if (!testResultNameAccept(name)) {
                    return;
                }

                if (value === null || typeof value === 'undefined') {
                    return;
                }

                if (typeof value === 'object') {
                    Object.keys(value).forEach(function (subName) {
                        fillSlots(subName, value[subName]);
                    });
                } else {
                    var slot = findSlot(name);
                    if (slot) {
                        slot.textContent = value;
                    } else {
                        console.warn('Could not find slot ' + name + ' for ' + domId, value);
                    }
                }
            }

            fillSlots('', results);

            removeClass(el, 'pass');
            removeClass(el, 'fail');
            removeClass(el, 'error');

            if (err) {
                addClass(el, 'error');

                var errorMessageEl = el.querySelector('.error-message');
                if (errorMessageEl) {
                    errorMessageEl.textContent = err;
                }
            } else if (results && results.passed) {
                addClass(el, 'pass');
            } else {
                addClass(el, 'fail');
            }

        },

        writeReport: function writeReport(results) {
            var allTestResultsEl = document.getElementById('all-test-results');
            var csv = [
                report.csv({
                    userAgent: window.navigator.userAgent,
                    language: window.navigator.language,
                    plugins: window.navigator.plugins
                }),
                '',
                report.csv(results, testResultNameAccept)
            ].join('\n');

            allTestResultsEl.textContent = csv;
        },

        buildTable: function buildTable(rootPath, desc) {
            function levelKeys(level) {
                return Object.keys(level).filter(function (key) {
                    return !/^\$/.test(key);
                });
            }

            var levels = [ ];
            var c = desc;
            while (c) {
                levels.push(c);
                c = c.$children;
            }

            // Array name means vertical; string means horizontal
            var columnNames = [ ];
            var columnTitles = [ ];
            var columnLevels = [ ];
            levels.forEach(function (level) {
                switch (level.$mode) {
                default:
                case 'vertical':
                    columnNames.push(levelKeys(level));
                    columnTitles.push(level.$title);
                    columnLevels.push(level);
                    break;

                case 'horizontal':
                    var names = levelKeys(level);
                    columnNames.push.apply(columnNames, names);

                    var titles = names.map(function (key) {
                        return level[key];
                    });
                    columnTitles.push.apply(columnTitles, titles);

                    names.forEach(function () {
                        columnLevels.push(level);
                    });

                    break;
                }
            });

            var verticalSizes = [ ];
            var cellLevels 
            var currentSize = 1;
            levels.reverse();
            levels.forEach(function (level) {
                verticalSizes.unshift(currentSize);

                switch (level.$mode) {
                default:
                case 'vertical':
                    currentSize *= levelKeys(level).length;
                    break;

                case 'horizontal':
                    levelKeys(level).slice(1).forEach(function () {
                        verticalSizes.unshift(currentSize);
                    });
                    break;
                }
            });
            levels.reverse();

            var table = document.createElement('table');
            var header = document.createElement('thead');
            table.appendChild(header);

            header.appendChild(tr(columnTitles.map(th)));

            var body = document.createElement('tbody');
            table.appendChild(body);

            var row, column;
            for (row = 0; row < currentSize; ++row) {
                var path = [ rootPath ];
                var columns = [ ];
                for (column = 0; column < columnNames.length; ++column) {
                    var level = columnLevels[column];

                    var cell;
                    var name = columnNames[column];
                    if (Array.isArray(name)) {
                        name = name[Math.floor(row / verticalSizes[column]) % name.length];
                        cell = th(level[name]);
                        path.push(name);
                    } else {
                        cell = td('');
                        cell.setAttribute('data-property', name);
                    }

                    if (level.$errors) {
                        var errorMessageEl = document.createElement('span');
                        addClass(errorMessageEl, 'error-message');
                        cell.appendChild(errorMessageEl);
                    }

                    if (row % verticalSizes[column] === 0) {
                        cell.rowSpan = verticalSizes[column];
                        columns.push(cell);
                    }
                }

                var rowEl = tr(columns);
                rowEl.id = path.join('-');
                addClass(rowEl, 'test');
                body.appendChild(rowEl);
            }

            return table;
        }
    };

    return testDom;
});
