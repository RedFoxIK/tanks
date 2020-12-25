import {BoardElement} from "./boardElement";
import {BoardSprite} from "./spriteWrapper";
import {Tank} from "./tank";

export abstract class Bonus extends BoardElement {
    public firstTick: number;
    public lifeTick: number;

    protected readonly tank: Tank;

    private lastTicks = 200;
    private appliedTicks = 500;

    protected constructor(boardSprite: BoardSprite, firstTick: number, lifeTick: number) {
        super(boardSprite, false, false, true);
        this.firstTick = firstTick;
        this.lifeTick = lifeTick;
        this.boardSprite.sprite.zIndex = 100;
    }

    public abstract apply(tank: Tank): void;
    public abstract finishEffect(): void;

    public isActive(tick: number) {
        return tick < this.firstTick + this.lifeTick;
    }

    public isAlmostGone(tick: number): boolean {
        return this.isActive(tick) && tick > this.firstTick + this.lifeTick - this.lastTicks;
    }

    public isFinished() {
        this.appliedTicks--;
        return this.appliedTicks <= 0;
    }

    public getTank() {
        return this.tank;
    }
}

export class Shield extends Bonus {

    constructor(boardSprite: BoardSprite, firstTick: number) {
        super(boardSprite, firstTick, 700);
    }

    public apply(tank: Tank): void {
        this.tank = tank;
        tank.makeImmortal();
        this.tank.boardSprite.sprite.alpha = 0.5;
    }

    public finishEffect(): void {
        this.tank.takeAwayImmortal();
        this.tank.boardSprite.sprite.alpha = 1;
    }
}

export class Life extends Bonus {

    constructor(boardSprite: BoardSprite, firstTick: number) {
        super(boardSprite, firstTick, 700);
    }

    public apply(tank: Tank): void {
        tank.addLife();
    }

    public finishEffect(): void {}
}

export class Snail extends Bonus {

    constructor(boardSprite: BoardSprite, firstTick: number) {
        super(boardSprite, firstTick, 600);
    }

    public apply(tank: Tank): void {
        this.tank = tank;
        tank.decreaseSpeed();
    }

    public finishEffect(): void {
        this.tank.setInitialSpeed();
    }
}

export class Speed extends Bonus {

    constructor(boardSprite: BoardSprite, firstTick: number) {
        super(boardSprite, firstTick, 700);
    }

    public apply(tank: Tank): void {
        this.tank = tank;
        tank.increaseSpeed();
    }

    public finishEffect(): void {
        this.tank.setInitialSpeed();
    }
}

export enum BonusType {
    SHIELD,
    LIFE,
    SNAIL,
    SPEED,
}
