import {Block, BoardObject, Eagle, Leaf, Wall, Water} from "../model/boardElement";
import {BoardSprite, SpriteWrapper} from "../model/spriteWrapper";

export class BoardElementsFactory {

    static createBoardElem(name: string, boardSprite: BoardSprite) {
        switch (name) {
            case BoardObject.WATER:
                return new Water(boardSprite);
            case BoardObject.LEAF:
                return new Leaf(boardSprite);
            case BoardObject.WALL:
                return new Wall(boardSprite);
            case BoardObject.BLOCK:
                return new Block(boardSprite);
            case BoardObject.EAGLE:
                return new Eagle(boardSprite);
        }
    }
}