import { Container, DisplayObject } from 'pixi.js';
import { Tween } from '@tweenjs/tween.js';

/**
 * Create a tween for showing a UI element.
 * @param pane 
 * @param timeMs 
 * @param endAlpha 
 * @returns 
 */
export const makeShowTween = <T extends DisplayObject>(pane: T, timeMs: number = 1000, endAlpha: number = 1) => {


    return new Tween(pane).duration(timeMs).to({ alpha: endAlpha }).onComplete(v => {
        v.visible = true;
    });

}

/**
 * Create a tween for hiding a UI element.
 * @param pane 
 * @param timeMs 
 * @param endAlpha 
 * @returns 
 */
export const makeHidetween = <T extends DisplayObject>(pane: T, timeMs: number = 1000, endAlpha: number = 0) => {

    return new Tween(pane).duration(timeMs).to({ alpha: endAlpha }).onComplete(v => v.visible = false);

}