import * as PIXI from 'pixi.js';
import {GameState, LoadGame} from "../gameState";
import Loader = PIXI.Loader;

export class GameApp {
    readonly app: PIXI.Application;
    readonly loader: Loader;
    private state: GameState;

    constructor(parent: HTMLElement, width: number, height: number) {
        this.app = new PIXI.Application({width, height, backgroundColor : 0x123E67});

        parent.replaceChild(this.app.view, parent.lastElementChild);
        // parent.appendChild(this.app.view);

        this.loader = new PIXI.Loader();
        this.state = new LoadGame();
    }

    startGame(): void {
        this.state.load(this);
    }
}
