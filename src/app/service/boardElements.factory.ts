import {Block, BoardObject, Eagle, Leaf, Wall, Water} from "../model/boardElement";
import {SpriteWrapper} from "../model/spriteWrapper";

export class BoardElementsFactory {

    static createBoardElem(name: string, spriteWrapper: SpriteWrapper) {
        switch (name) {
            case BoardObject.WATER:
                return new Water(spriteWrapper);
            case BoardObject.LEAF:
                return new Leaf(spriteWrapper);
            case BoardObject.WALL:
                return new Wall(spriteWrapper);
            case BoardObject.BLOCK:
                return new Block(spriteWrapper);
            case BoardObject.EAGLE:
                return new Eagle(spriteWrapper);
        }
    }
}