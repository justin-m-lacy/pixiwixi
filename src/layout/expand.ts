import { ILayout, ChildLayout } from './layout';
import { Rectangle, Container } from 'pixi.js';

/**
 * Expand item to fill its layout space.
 */
export class Expand extends ChildLayout {

    constructor(child: ILayout | Container) {
        super(child);
    }

    onLayout(rect: Rectangle, child: Container,): Container {

        child.position.set(rect.x, rect.y);
        child.width = rect.width;
        child.height = rect.height;

        return child;

    }



}