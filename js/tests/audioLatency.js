define([ ], function () {
    function getPlayLatency(audio, callback) {
        var startTime;

        function update() {
            var endTime = Date.now();

            audio.removeEventListener('play', update, false);
            audio.removeEventListener('timeupdate', update, false);
            audio.pause();

            callback(null, endTime - startTime);
        }

        audio.addEventListener('play', update, false);
        audio.addEventListener('timeupdate', update, false);

        startTime = Date.now();
        audio.play();
    }

    return function audioLatency(callback) {
        if (!window.Audio) {
            callback(new Error('Audio not supported'));
            return;
        }

        var audio = new window.Audio();

        function onCanPlayThrough() {
            audio.removeEventListener('canplaythrough', onCanPlayThrough, false);

            // Run the test twice: once for "cold" time, once for "warm" time.
            getPlayLatency(audio, function (err, coldTime) {
                if (err) {
                    callback(err);
                    return;
                }

                getPlayLatency(audio, function (err, warmTime) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    callback(null, {
                        pass: true,
                        coldLatency: coldTime,
                        warmLatency: warmTime
                    });
                });
            });
        }

        function onError() {
            callback(new Error('Failed to load audio'));
        }

        var source = document.createElement('source');
        source.src = 'assets/silence.wav';
        source.addEventListener('error', onError, false);

        audio.addEventListener('canplaythrough', onCanPlayThrough, false);
        audio.addEventListener('error', onError, false);
        audio.appendChild(source);
        audio.play();
    };
});
