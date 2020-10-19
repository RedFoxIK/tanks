import {Tank} from "./tank";

export abstract class Bonus {
    abstract apply(tank: Tank): void;
    abstract finishEffect(tank: Tank): void;
}

export class Shield extends Bonus {

    apply(tank: Tank): void {
        tank.makeImmortal();
    }

    finishEffect(tank: Tank): void {
        tank.takeAwayImmortal();
    }
}

export class Life extends Bonus {

    apply(tank: Tank): void {
        tank.addLife();
    }

    finishEffect(tank: Tank): void {}
}

export class Snail extends Bonus {

    apply(tank: Tank): void {
        tank.decreaseSpeed();
    }

    finishEffect(tank: Tank): void {
        tank.increaseSpeed();
    }
}

export class Lighting extends Bonus {

    apply(tank: Tank): void {
        tank.increaseSpeed();
    }

    finishEffect(tank: Tank): void {
        tank.decreaseSpeed();
    }
}
