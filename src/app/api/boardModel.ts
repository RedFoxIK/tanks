import {BoardObject, Point} from "../model/boardElement";

export class BoardModel {
    public readonly block: BoardItemModel;
    public readonly eagle: BoardItemModel;
    public readonly leaves: BoardItemModel;
    public readonly walls1: BoardItemModel;
    public readonly walls2: BoardItemModel;
    public readonly walls3: BoardItemModel;
    public readonly walls4: BoardItemModel;
    public readonly water: BoardItemModel;
}

export class BoardItemModel {
    public readonly boardElem: BoardObject;
    public readonly assets: Point[];
    public readonly type?: number;
}
