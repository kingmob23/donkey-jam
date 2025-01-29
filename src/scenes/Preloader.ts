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

        this.load.image('game-background', 'background.png');
        this.load.audio('sountrack', 'lenya_bangs.mp3');

        this.load.image('player', 'monke.png');
        this.load.image('ak', 'ak.png');
        this.load.image('bang', 'bang.png');
        this.load.audio('shot', 'gunshot.mp3');

        this.load.image('enemy', 'gom.png');

        this.load.setPath('assets/pile');
        this.load.image('pile', 'pile.png');
        this.load.image('pile1', 'pile1.png');
        this.load.image('pile2', 'pile2.png');
        this.load.image('trash', 'trash.png');
        this.load.image('fuel', 'fuel.png');
        this.load.image('wire', 'wire.png');
        this.load.image('steam_pipe', 'steam_pipe.png');
        this.load.image('magnet', 'magnet.png');
        this.load.image('membrane', 'membrane.png');
        this.load.image('amplifier', 'amp.png');

        this.load.setPath('assets/UI/monkey');
        this.load.image('healthy', 'healthy.png');
        this.load.image('owtch1', 'owtch1.png');
        this.load.image('owtch2', 'owtch2.png');
        this.load.image('owtch3', 'owtch3.png');
        this.load.image('dead', 'dead.png');
    }

    create() {
        const items = [
            { key: 'trash', x: 200, y: 300 },
            { key: 'fuel', x: 400, y: 300 },
            { key: 'wire', x: 600, y: 300 },
            { key: 'steam_pipe', x: 800, y: 300 },
            { key: 'magnet', x: 1000, y: 300 },
            { key: 'membrane', x: 1200, y: 300 },
            { key: 'amplifier', x: 1400, y: 300 }
        ];
    
    }
}