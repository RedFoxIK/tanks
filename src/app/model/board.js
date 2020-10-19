"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Board = /** @class */ (function () {
    function Board(boardElements) {
        this.width = 32;
        this.height = 32;
        this.boardElements = boardElements;
    }
    Board.prototype.removeDestroyedObjects = function () {
        this.boardElements = this.boardElements.filter(function (boardEl) { return !boardEl.isDestroyed(); });
    };
    return Board;
}());
exports.Board = Board;
