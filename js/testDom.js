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

            Object.keys(results).forEach(function (name) {
                var slot = findSlot(name);

                if (slot) {
                    slot.textContent = results[name];
                }
            });

            el.classList.remove('pass');
            el.classList.remove('fail');
            el.classList.add(passed ? 'pass' : 'fail');
        }
    };

    return testDom;
});
