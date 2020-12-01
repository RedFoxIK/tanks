import {GameApp} from "./controller/gameApp";
import images from '../assets/images/board/*.png';
import bonuses from '../assets/images/bonus/*.png';
import sounds from '../assets/sounds/*.wav';
import otherImages from '../assets/other/*.png';
import * as PIXI from 'pixi.js';
import {ImagePath} from "./model/imagePath";

export interface GameState {
    load(gameApp: GameApp);
}

export class LoadGame implements GameState {
    load(gameApp: GameApp) {
        const stage = gameApp.app.stage;

        gameApp.loader
            .add(Object.values(images))
            .add('startBtn', 'assets/images/loader_bar/button.png')
            .add(ImagePath.all)
            .add(Object.values(sounds))
            .add(Object.values(bonuses))
            .add(Object.values(otherImages));

        gameApp.loader.load();

        const title = new PIXI.Text('Tank Game', {fontSize: 100, fontFamily: 'Snippet', fill: 'white'});
        title.position.x = 280;
        title.position.y = 200;
        stage.addChild(title);

        const progressBarBorder = new PIXI.Sprite(PIXI.Texture.from('assets/images/loader_bar/loader-bg.png'));
        progressBarBorder.x = 200;
        progressBarBorder.y = 500;
        progressBarBorder.width = 600;
        progressBarBorder.height = 80
        stage.addChild(progressBarBorder);

        const progressBarBg = new PIXI.Sprite(PIXI.Texture.from('assets/images/loader_bar/loader-bar.png'));
        progressBarBg.x = 205;
        progressBarBg.y = 505;
        progressBarBg.width = 0;
        progressBarBg.height = 70;
        stage.addChild(progressBarBg);

        gameApp.loader.onProgress.add(e => {
            progressBarBg.width = 590 * (e.progress * 0.01);
            gameApp.app.renderer.render(stage);
        })

        gameApp.loader.onComplete.add((loader, resources) => {
            stage.removeChild(progressBarBorder, progressBarBg);

            const button = new PIXI.Sprite(resources.startBtn.texture);
            button.x = 350;
            button.y = 450;

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

