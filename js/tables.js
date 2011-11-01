define([ ], function () {
    return {
        performance: {
            sprites: {
                $title: 'Source type',
                image: 'Static <img>',
                spriteSheet: 'Animated sprite sheet',

                $children: {
                    $title: 'Technique',
                    css2dImg: 'CSS3 2D transforms with <img>',
                    css3dImg: 'CSS3 3D transforms with <img>',
                    css2dBackground: 'CSS3 2D transforms with CSS backgrounds',
                    css3dBackground: 'CSS3 3D transforms with CSS backgrounds',
                    cssWebkitMatrix: 'WebKitCSSMatrix transforms with <img>',
                    canvasDrawImageFullClear: 'Canvas drawImage, full clear',

                    $children: {
                        $title: 'Test type',
                        $errors: true,
                        scale: 'Scale',
                        translate: 'Translate',
                        rotate: 'Rotate',

                        $children: {
                            $mode: 'horizontal',
                            js: 'JS time (ms)',
                            total: 'Total time (ms)'
                        }
                    }
                }
            }
        }
    };
});
