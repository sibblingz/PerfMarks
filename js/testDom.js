define([ ], function () {
    var testDom = {
        endTest: function (domId, passed, results) {
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
                if (name === 'pass') {
                    return;
                }

                if (typeof value === 'object' && value) {
                    Object.keys(value).forEach(function (subName) {
                        fillSlots(name ? name + '.' + subName : subName, value[subName]);
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

            el.classList.remove('pass');
            el.classList.remove('fail');
            el.classList.add(passed ? 'pass' : 'fail');
        }
    };

    return testDom;
});
