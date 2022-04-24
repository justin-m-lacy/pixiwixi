import { Application, InteractionEvent } from 'pixi.js';

export interface Focusable {

    focus(evt: InteractionEvent): void;
    unfocus(): void;

}

export class FocusManager {

    static Current: FocusManager;

    readonly app: Application;

    currentFocus: Focusable | null = null;

    _active: boolean = false;

    constructor(app: Application) {

        this.app = app;
        FocusManager.Current = this;

    }

    clearFocus() {

        if (this.currentFocus != null) {

            const focus = this.currentFocus;
            this.currentFocus = null;
            focus.unfocus();

        }

    }

    start() {
        if (!this._active) {
            this._active = true;
            this.app.stage.on('pointerdown', this.clearFocus);
        }
    }

    stop() {
        if (this._active) {
            this.app.stage.off('pointerdown', this.clearFocus);
            this._active = false;
        }
    }

}