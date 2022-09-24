import * as PIXI from 'pixi.js';
import { DisplayObject } from 'pixi.js';

/**
 * Enable mouse wheel events on PIXI application.
 * @param app 
 */
export const enablewheel = (app: PIXI.Application) => {

    const wc = new WheelControl(app);
    wc.enable();

    return wc;

}

export class WheelControl {

    private _wheelFunc?: (e: WheelEvent) => void;
    private _wheelEnabled: boolean = false;
    private _wheelScale: number = 1;

    private _app: PIXI.Application;

    constructor(app: PIXI.Application) {

        this._app = app;

    }

    enable() {

        if (!this._wheelEnabled) {

            this._wheelEnabled = true;
            if (!this._wheelFunc) {
                this._wheelFunc = this._makeListener(this._app);
            }
            this._app.view.addEventListener('wheel', this._wheelFunc);
        }

    }

    disable() {

        if (this._wheelEnabled === true) {

            this._wheelEnabled = false;
            if (this._wheelFunc != null) {
                this._app.view.removeEventListener('wheel', this._wheelFunc!);
            }
        }


    }

    private _makeListener(app: PIXI.Application) {

        const mgr = app.renderer.plugins.interaction;

        // store to remove later.
        return (e: WheelEvent) => {

            let evt = new PIXI.InteractionEvent();
            let data = new PIXI.InteractionData();

            data.originalEvent = e;
            e.deltaY * this._wheelScale;
            e.deltaX * this._wheelScale;

            data.originalEvent = e;

            Object.assign(data, mgr.eventData);

            let target: DisplayObject = evt.target = data.target;
            evt.data = data;
            evt.type = 'wheel';

            while (target) {

                if (target.interactive === true) {
                    evt.currentTarget = target;
                    target.emit('wheel', evt);
                }
                target = target.parent;

            }

        };

    }

    destroy() {

        if (this._wheelEnabled) {
            this.disable();
        }
        this._wheelFunc = undefined;
    }

};