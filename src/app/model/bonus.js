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
var Bonus = /** @class */ (function () {
    function Bonus() {
    }
    return Bonus;
}());
exports.Bonus = Bonus;
var Shield = /** @class */ (function (_super) {
    __extends(Shield, _super);
    function Shield() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Shield.prototype.apply = function (tank) {
        tank.makeImmortal();
    };
    Shield.prototype.finishEffect = function (tank) {
        tank.takeAwayImmortal();
    };
    return Shield;
}(Bonus));
exports.Shield = Shield;
var Life = /** @class */ (function (_super) {
    __extends(Life, _super);
    function Life() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Life.prototype.apply = function (tank) {
        tank.addLife();
    };
    Life.prototype.finishEffect = function (tank) { };
    return Life;
}(Bonus));
exports.Life = Life;
var Snail = /** @class */ (function (_super) {
    __extends(Snail, _super);
    function Snail() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Snail.prototype.apply = function (tank) {
        tank.decreaseSpeed();
    };
    Snail.prototype.finishEffect = function (tank) {
        tank.increaseSpeed();
    };
    return Snail;
}(Bonus));
exports.Snail = Snail;
var Lighting = /** @class */ (function (_super) {
    __extends(Lighting, _super);
    function Lighting() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Lighting.prototype.apply = function (tank) {
        tank.increaseSpeed();
    };
    Lighting.prototype.finishEffect = function (tank) {
        tank.decreaseSpeed();
    };
    return Lighting;
}(Bonus));
exports.Lighting = Lighting;
