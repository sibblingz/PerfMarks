Basic benchmarks to measure HTML5 performance and support for game related features

Running the Tests
-----------------

1. Get [Node.js][1] and [npm][2].
2. Run in shell: `npm install`
3. Open in browser: `http://localhost:3002/`
4. If you wish to record the tests, enter your browser or device identifier
   under "Your name".  (This string is uploaded to your server only; it does
   not change the behaviour of any testing and is used purely in the output
   JSON and CSV as metadata.)
5. Click "Run Tests" (or "Run Tests and Upload Results").
6. If you uploaded results, see `server/uploads/`.
7. To output to CSV, run in shell: `node bin/json2csv.js server/uploads/xxx.json`

[1]: http://nodejs.org/
[2]: http://npmjs.org/

Interpreting Results
--------------------

### Sprite tests

The `Source type` indicates the data being displayed.

The `Technique` indicates the browser method used to render the data.

The `Test type` indicates what transformations were performed on the data using
the technique.

The `JS time (ms)` result shows how much JavaScript time was spent rendering
the objects in one second.

The `Objects at 30FPS` result shows how many objects were able to be rendered
while rendering at 30 frames per second.

### Audio latency test

The `Cold play latency` indicates how much time it took between `.play()` and
the first subsequent `play` or `timeupdate` event on a new WAV `<audio>`
element.

The `Warm play latency` indicates how much time it took between `.play()` and
the first subsequent `play` or `timeupdate` event on a WAV `<audio>` element
which has already played.

### Canvas text test

The `Score` result shows how many renders could be made per 100 milliseconds.

Code structure
--------------

Test cases are build into a recursive object structure.  Test cases are run
through the test runner in `js/testRunner.js`.

Test cases are displayed based upon the specification in `js/tables.js`.

### Sprite tests

Sprite tests are found under `js/sprites/`.

There are three interleaved components:

#### Sources

Each source represents some asset (e.g. a sprite sheet).  Maps to the `Source
type` result.

#### Transformers

Transformers modify the source by applying affine or other transformations.
Maps to the `Test type` result.

#### Renderers

Renderers displayed transformed sources using different techniques.  Maps to the
`Technique` result.  See `js/sprites/renderers/README.md` for details.
