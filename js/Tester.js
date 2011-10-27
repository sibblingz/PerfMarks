define([ 'util/ensureCallback' ], function (ensureCallback) {
    function Tester(callback) {
    }

    Tester.prototype.onStepComplete = function onStepComplete(callback) {
        this.stepCompleteCallbacks.push(ensureCallback(callback));
    };

    Tester.prototype.onComplete = function onComplete(callback) {
        this.stepCompleteCallbacks.push(ensureCallback(callback));
    };
});
