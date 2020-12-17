import {Tank} from "./tank";
import {BoardElement} from "./boardElement";
import {BoardSprite} from "./spriteWrapper";

export abstract class Bonus extends BoardElement {
    firstTick: number;
    lifeTick: number;

    protected constructor(boardSprite: BoardSprite, firstTick: number, lifeTick: number) {
        super(boardSprite, false, false, true);
        this.firstTick = firstTick;
        this.lifeTick = lifeTick;
    }

    abstract apply(tank: Tank): void;
    abstract finishEffect(tank: Tank): void;

    isActive(tick: number) {
        return tick < this.firstTick + this.lifeTick;
    }
}

export class Shield extends Bonus {

    constructor(boardSprite: BoardSprite, firstTick: number) {
        super(boardSprite, firstTick, 200);
    }

    apply(tank: Tank): void {
        tank.makeImmortal();
    }

    finishEffect(tank: Tank): void {
        tank.takeAwayImmortal();
    }
}

export class Life extends Bonus {

    constructor(boardSprite: BoardSprite, firstTick: number) {
        super(boardSprite, firstTick, 200);
    }

    apply(tank: Tank): void {
        tank.addLife();
    }

    finishEffect(tank: Tank): void {}
}

export class Snail extends Bonus {

    constructor(boardSprite: BoardSprite, firstTick: number) {
        super(boardSprite, firstTick, 200);
    }

    apply(tank: Tank): void {
        tank.decreaseSpeed();
    }

    finishEffect(tank: Tank): void {
        tank.increaseSpeed();
    }
}

export class Speed extends Bonus {

    constructor(boardSprite: BoardSprite, firstTick: number) {
        super(boardSprite, firstTick, 200);
    }

    apply(tank: Tank): void {
        tank.increaseSpeed();
    }

    finishEffect(tank: Tank): void {
        tank.decreaseSpeed();
    }
}

export enum BonusType {
    SHIELD,
    LIFE,
    SNAIL,
    SPEED
}