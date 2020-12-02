import {StageUtilsService} from "./stage-utils.service";
import {LoaderUtilsService} from "./loader-utils.service";
import {BoardAsset} from "../model/asset";

export class BoardGeneratorService {
    private stageUtilsService: StageUtilsService;
    private loaderService: LoaderUtilsService;

    constructor(stageUtilsService: StageUtilsService, loaderService: LoaderUtilsService) {
        this.stageUtilsService = stageUtilsService;
        this.loaderService = loaderService;
    }

    public generateBoard() {
        for (let i = 0; i < 32; i++) {
            let blockLeft = this.loaderService.createSpriteFromLoadedTexture(BoardAsset, BoardAsset.BLOCK);
            let blockRight = this.loaderService.createSpriteFromLoadedTexture(BoardAsset, BoardAsset.BLOCK);
            let blockUp = this.loaderService.createSpriteFromLoadedTexture(BoardAsset, BoardAsset.BLOCK);
            let blockDown = this.loaderService.createSpriteFromLoadedTexture(BoardAsset, BoardAsset.BLOCK);

            this.stageUtilsService.addSprite(blockLeft, 0, i * 24, 24, 24);
            this.stageUtilsService.addSprite(blockRight, 744, i * 24, 24, 24);
            this.stageUtilsService.addSprite(blockUp, i * 24, 0, 24, 24);
            this.stageUtilsService.addSprite(blockDown,  i * 24, 744, 24, 24);
        }
    }
}
