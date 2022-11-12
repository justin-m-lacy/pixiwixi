import { DisplayObject } from 'pixi.js';
import { Tween } from 'tweedle.js';

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
export const makeHideTween = <T extends DisplayObject>(pane: T, timeMs: number = 1000, endAlpha: number = 0) => {

    return new Tween(pane).duration(timeMs).to({ alpha: endAlpha }).onComplete(v => v.visible = false);

}