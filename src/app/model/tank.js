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
var boardElement_1 = require("./boardElement");
var image_1 = require("./image");
var Tank = /** @class */ (function (_super) {
    __extends(Tank, _super);
    function Tank(x, y, tankType) {
        var _this = _super.call(this, image_1.Image.TANK, x, y, true, 2) || this;
        _this.startX = x;
        _this.startY = y;
        _this.tankType = tankType;
        _this.lifeAmount = 1;
        _this.isImmortal = false;
        return _this;
    }
    Tank.prototype.addLife = function () {
        this.lifeAmount += 1;
    };
    Tank.prototype.takeLife = function () {
        this.lifeAmount -= 1;
        if (!this.isDead()) {
            this.resetPosition(this.startX, this.startY);
        }
        else {
            this.destroy();
        }
    };
    Tank.prototype.takeWound = function (shooter) {
        if (!this.isImmortal && this.tankType != shooter.tankType) {
            this.takeLife();
        }
    };
    Tank.prototype.isDead = function () {
        return this.lifeAmount > 0;
    };
    Tank.prototype.increaseSpeed = function () {
        this.speed += 1;
    };
    Tank.prototype.decreaseSpeed = function () {
        this.speed -= 1;
    };
    Tank.prototype.makeImmortal = function () {
        this.isImmortal = true;
    };
    Tank.prototype.takeAwayImmortal = function () {
        this.isImmortal = false;
    };
    return Tank;
}(boardElement_1.MovableBoardElement));
exports.Tank = Tank;
var TankType;
(function (TankType) {
    TankType[TankType["PLAYER"] = 0] = "PLAYER";
    TankType[TankType["ENEMY"] = 1] = "ENEMY";
})(TankType = exports.TankType || (exports.TankType = {}));
