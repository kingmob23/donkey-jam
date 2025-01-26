import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        // Отображение фонового изображения, если оно уже загружено в Boot сцене
        this.add.image(512, 384, 'background');

        // Создание контейнера для прогресс-бара
        const progressBox = this.add.rectangle(512, 384, 468, 32, 0xffffff, 0.2);
        progressBox.setStrokeStyle(1, 0xffffff);

        // Создание самого прогресс-бара
        const progressBar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
        progressBar.setOrigin(0, 0.5);

        // Обновление прогресс-бара при загрузке ресурсов
        this.load.on('progress', (progress: number) => {
            progressBar.width = 4 + (460 * progress);
        });

        // Обработка события загрузки
        this.load.on('complete', () => {
            // Переход к следующей сцене после завершения загрузки
            this.scene.start('MainMenu'); // Измените на 'Game', если хотите запускать сцену Game
        });
    }

    preload() {
        this.load.setPath('assets');

        // Game background and soundtrack
        this.load.image('game-background', 'background.png');
        this.load.audio('sountrack', 'lenya_bangs.mp3');

        // Player assets
        this.load.image('player', 'monke.png');
        this.load.image('ak', 'ak.png');
        this.load.image('bang', 'bang.png');
        this.load.audio('shot', 'gunshot.mp3');

        // Enemy assets
        this.load.image('enemy', 'gom.png');

        // Pile assets
        this.load.setPath('assets/pile');
        this.load.image('pile', 'pile.png');
        this.load.image('pile1', 'pile1.png');
        this.load.image('pile2', 'pile2.png');

        // Drop assets
        this.load.image('trash', 'trash.png');
        this.load.image('fuel', 'fuel.png');
        this.load.image('wire', 'wire.png');
        this.load.image('steam_pipe', 'steam_pipe.png');
        this.load.image('magnet', 'magnet.png');
        this.load.image('membrane', 'membrane.png');
        this.load.image('amplifier', 'amp.png');

        // Reset path for UI assets
        this.load.setPath('assets');

        // UI assets
        this.load.image('ebalo', 'UI_mc_healty.png');
        this.load.image('ebalored', 'UI_mc_healtyred.png');
        this.load.image('ebalodmg1', 'UI_mc_owtch1.png');
        this.load.image('ebalodmg2', 'UI_mc_owtch2.png');
        this.load.image('ebalodmg3', 'UI_mc_owtch3.png');
        this.load.image('ebalodead', 'UI_mc_dead.png');
    }

    create() {
        // Этот метод не используется, так как переход к следующей сцене происходит в обработчике события 'complete'
    }
}