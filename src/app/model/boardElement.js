"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var direction_1 = require("./direction");
var image_1 = require("./image");
var BoardElement = /** @class */ (function () {
    function BoardElement(image, x, y, isDestroyable) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.isDestroyable = isDestroyable;
    }
    BoardElement.prototype.resetPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    BoardElement.prototype.destroy = function () {
        if (this.isDestroyable) {
            // this.x = null;
            // this.y = null;
        }
    };
    BoardElement.prototype.isDestroyed = function () {
        return this.x === null || this.y === null;
    };
    return BoardElement;
}());
exports.BoardElement = BoardElement;
var MovableBoardElement = /** @class */ (function (_super) {
    __extends(MovableBoardElement, _super);
    function MovableBoardElement(image, x, y, isDestroyable, speed) {
        var _this = _super.call(this, image, x, y, isDestroyable) || this;
        _this.speed = speed;
        return _this;
    }
    MovableBoardElement.prototype.move = function (direction) {
        switch (direction) {
            case direction_1.Direction.UP:
                this.y += 1;
                break;
            case direction_1.Direction.DOWN:
                this.y -= 1;
                break;
            case direction_1.Direction.RIGHT:
                this.x += 1;
                break;
            case direction_1.Direction.LEFT:
                this.x -= 1;
                break;
        }
    };
    return MovableBoardElement;
}(BoardElement));
exports.MovableBoardElement = MovableBoardElement;
// export class Bullet extends MovableBoardElement {
//
//     constructor(x: number, y: number) {
//         super(x, y, true, 4);
//     }
// }
var Eagle = /** @class */ (function (_super) {
    __extends(Eagle, _super);
    function Eagle(x, y) {
        return _super.call(this, image_1.Image.EAGLE, x, y, true) || this;
    }
    return Eagle;
}(BoardElement));
exports.Eagle = Eagle;
var Wall = /** @class */ (function (_super) {
    __extends(Wall, _super);
    function Wall(image, x, y) {
        return _super.call(this, image, x, y, true) || this;
    }
    return Wall;
}(BoardElement));
exports.Wall = Wall;
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block(x, y) {
        return _super.call(this, image_1.Image.BLOCK, x, y, false) || this;
    }
    return Block;
}(BoardElement));
exports.Block = Block;
var Water = /** @class */ (function (_super) {
    __extends(Water, _super);
    function Water(x, y) {
        return _super.call(this, image_1.Image.WATER, x, y, false) || this;
    }
    return Water;
}(BoardElement));
exports.Water = Water;
var Leaf = /** @class */ (function (_super) {
    __extends(Leaf, _super);
    function Leaf(x, y) {
        return _super.call(this, image_1.Image.LEAVES, x, y, false) || this;
    }
    return Leaf;
}(BoardElement));
exports.Leaf = Leaf;
