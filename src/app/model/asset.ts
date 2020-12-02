export type Asset = BoardAsset | BonusAsset | ButtonAsset | TankAsset | SoundAsset;

export enum BoardAsset {
    BLOCK = 'assets/images/board/block.png',
    EAGLE = 'assets/images/board/eagle.png',
    LEAVES = 'assets/images/board/leaves.png',
    WALL_1 = 'assets/images/board/wall_1.png',
    WALL_2 = 'assets/images/board/wall_2.png',
    WALL_3 = 'assets/images/board/wall_3.png',
    WALL_4 = 'assets/images/board/wall_4.png',
    WATER = 'assets/images/board/water.png',
}

export enum BonusAsset {
    LIVE = 'assets/images/bonus/live.png',
    SHIELD = 'assets/images/bonus/shield.png',
    SNAIL = 'assets/images/bonus/snail.png',
    SPEED = 'assets/images/bonus/speed.png',
}

export enum ButtonAsset {
    START = 'assets/images/buttons/start.png',
    HIGH_SCORE = 'assets/images/buttons/scores.png',
}

export enum TankAsset {
    TANK = 'assets/images/tanks/tank.png',
    ENEMY_TANK_1 = 'assets/images/tanks/enemy_blue.png',
    ENEMY_TANK_2 = 'assets/images/tanks/enemy_red.png',
    ENEMY_TANK_3 = 'assets/images/tanks/enemy_white.png',
    BULLET = 'assets/images/tanks/bullet.png',
    ENEMY_BULLET = 'assets/images/tanks/enemy_bullet.png',
}

export enum LoaderAsset {
    LOADER_BG = 'assets/images/loader/loader-bg.png',
    LOADER_BAR = 'assets/images/loader/loader-bar.png'
}

export enum SoundAsset {
    BONUS = 'assets/sounds/bonus.wav',
    EXPLODE = 'assets/sounds/explode.wav',
    HIT = 'assets/sounds/hit.wav',
    LOSE = 'assets/sounds/lose.wav',
    SHOT = 'assets/sounds/shot.wav',
    WIN = 'assets/sounds/win.wav',
}
