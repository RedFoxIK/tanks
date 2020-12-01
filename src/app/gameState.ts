import {GameApp} from "./controller/gameApp";
import images from '../assets/images/board/*.png';
import bonuses from '../assets/images/bonus/*.png';
import sounds from '../assets/sounds/*.wav';
import otherImages from '../assets/other/*.png';
import * as PIXI from 'pixi.js';
import {BoardAsset} from "./model/asset";

export interface GameState {
    load(gameApp: GameApp);
}

export class LoadGame implements GameState {
    load(gameApp: GameApp) {
        const stage = gameApp.app.stage;

        console.log(Object.values(BoardAsset));

        Object.values(BoardAsset).forEach(value => console.log(value.name))
        Object.values(BoardAsset).forEach(value => console.log(value))

        gameApp.loader
            .add(Object.values(images))
            .add('startBtn', 'assets/images/buttons/start.png')
            .add(Object.values(sounds))
            .add(Object.values(bonuses))
            .add(Object.values(otherImages));

        gameApp.loader.load();

        const title = new PIXI.Text('Tank Game', {fontSize: 100, fontFamily: 'Snippet', fill: 'white'});
        title.position.x = 280;
        title.position.y = 200;
        stage.addChild(title);

        const progressBarBg = new PIXI.Sprite(PIXI.Texture.from('assets/images/loader/loader-bg.png'));
        progressBarBg.x = 200;
        progressBarBg.y = 500;
        progressBarBg.width = 600;
        progressBarBg.height = 80
        stage.addChild(progressBarBg);

        const progressBar = new PIXI.Sprite(PIXI.Texture.from('assets/images/loader/loader-bar.png'));
        progressBar.x = 205;
        progressBar.y = 505;
        progressBar.width = 0;
        progressBar.height = 70;
        stage.addChild(progressBar);

        gameApp.loader.onProgress.add(e => {
            progressBar.width = 590 * (e.progress * 0.01);
            gameApp.app.renderer.render(stage);
        })

        gameApp.loader.onComplete.add((loader, resources) => {
            stage.removeChild(progressBarBg, progressBar);

            const button = new PIXI.Sprite(resources.startBtn.texture);
            button.x = 350;
            button.y = 450;
            console.log(button);

            button.interactive = true;
            button.buttonMode = true;

            button.on("pointerdown", () => {
                stage.removeChild(button, title);
            })

            gameApp.app.stage.addChild(button);

        })
    }
}

export class PlayGame
    implements GameState {
    load(gameApp: GameApp) {
    }

}

export class FinishGame implements GameState {
    load(gameApp: GameApp) {
    }

}

