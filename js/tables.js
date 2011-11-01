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
                        $title: 'Object count',
                        '1': '1',
                        '5': '5',
                        '15': '15',
                        '30': '30',
                        '100': '100',

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
            },

            text: {
                $title: 'Font family',
                sans: 'sans-serif',
                serif: 'serif',
                monospace: 'monospace',

                $children: {
                    $title: 'Font size',
                    '8': '8pt',
                    '10': '10pt',
                    '12': '12pt',
                    '14': '14pt',
                    '16': '16pt',
                    '24': '24pt',

                    $children: {
                        $title: 'Style',
                        outline: 'Solid outline',
                        fill: 'Solid fill',
                        fillOutline: 'Solid fill + outline',

                        $children: {
                            $mode: 'horizontal',
                            draw: 'Text draw time (ms)',
                            flush: 'Flush time (ms)',
                            total: 'Total time (ms)'
                        }
                    }
                }
            }
        }
    };
});
