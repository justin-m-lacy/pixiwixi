
import { Center } from '../layout/center';
import { Container } from 'pixi.js';
import { Pane, PaneOptions } from '../panes/pane';


export type ButtonOptions = PaneOptions & { onClick?: () => void, child?: Container }
export class Button extends Pane {

    /**
     */
    constructor(opts?: ButtonOptions) {

        super(opts);

        this.interactive = true;
        if (opts) {
            if (opts.onClick) {
                this.on('pointerup', opts.onClick);
            }
            const child = opts.child;
            if (child) {

                const padding = 2 * (opts.padding ?? 6);
                this.width = child.width + padding;
                this.height = child.height + padding;

                this.addChild(child);

            }
            if (opts.width) {
                this.width = opts.width;
            }
            if (opts.height) {
                this.height = opts.height;
            }
            if (child) {
                super.build(new Center(child));
            }
        }

        this.layout();

    }

}