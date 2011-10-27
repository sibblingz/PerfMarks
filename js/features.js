define([ ], function () {
    // CSS transform feature detection based off of
    // http://andrew-hoyer.com/experiments/rain/
    // Public domain

    var style = document.createElement('div').style;

    function getStyleName(propertyNames) {
        return propertyNames.filter(function(name) {
            return name in style;
        }).shift();
    }

    var transformOriginStyleProperty = getStyleName([
        'transformOrigin',
        'WebkitTransformOrigin',
        'MozTransformOrigin',
        'msTransformOrigin',
        'OTransformOrigin'
    ]);

    var transformStyleProperty = getStyleName([
        'transform',
        'WebkitTransform',
        'MozTransform',
        'msTransform',
        'OTransform'
    ]);

    // Firefox has a bug where it requires 'px' for translate matrix
    // elements (where it should accept plain numbers).
    var matrixTranslateSuffix = transformStyleProperty === 'MozTransform' ? 'px' : '';

    return {
        transformOriginStyleProperty: transformOriginStyleProperty,
        transformStyleProperty: transformStyleProperty,
        matrixTranslateSuffix: matrixTranslateSuffix
    }
});
