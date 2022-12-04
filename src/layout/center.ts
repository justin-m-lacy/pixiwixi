import { ChildLayout, } from './layout';
import { Rectangle, Container } from 'pixi.js';

/**
 * Applies a layout and centers it in parent display.
 */
export class Center extends ChildLayout {

    onLayout(rect: Rectangle, child: Container): Container {

        if (child.width > rect.width) {
            child.width = rect.width;
        }
        if (child.height > rect.height) {
            child.height = rect.height;
        }

        child.x = rect.x + (rect.width - child.width) / 2;
        child.y = rect.y + (rect.height - child.height) / 2;

        return child;
    }

}