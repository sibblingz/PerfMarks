define([ ], function () {
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
                if (name === 'pass') {
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

            el.classList.remove('pass');
            el.classList.remove('fail');
            el.classList.remove('error');

            if (err) {
                el.classList.add('error');

                var errorMessageEl = el.querySelector('.error-message');
                if (errorMessageEl) {
                    errorMessageEl.textContent = err;
                }
            } else if (results && results.passed) {
                el.classList.add('pass');
            } else {
                el.classList.add('fail');
            }
        }
    };

    return testDom;
});
