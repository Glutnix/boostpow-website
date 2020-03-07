

import * as buffer from 'buffer';

/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 **/
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 */

// (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
// (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
// (window as any).__zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames

/*
 * in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 * with the following flag, it will bypass `zone.js` patch for IE/Edge
 */
// (window as any).__Zone_enable_cross_context_check = true;

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js/dist/zone'; // Included with Angular CLI.

/***************************************************************************************************
 * APPLICATION IMPORTS
 */

(window as any).global = window;
(window as any).process = {};
(window as any).process = window;
(window as any).process.browser = true;
(window as any).process.version = '';
(window as any).process.versions = {node: false};
(window as any).process.nextTick = (() => {
    const canSetImmediate = typeof window !== 'undefined'
        && (window as any).setImmediate;
    const canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener;
    if (canSetImmediate) {
        return (f) => {
            return (window as any).setImmediate(f);
        };
    }
    if (canPost) {
        const queue = [];
        window.addEventListener('message', (ev) => {
            const source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    const fn = queue.shift();
                    fn();
                }
            }
        }, true);
        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }
    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();
(window as any).global.Buffer = (window as any).global.Buffer || buffer.Buffer;
