// src/scenes/Game.ts
import { Scene } from 'phaser';
import { Enemy } from '../objects/Enemy';
import { Player } from '../objects/Player';

export class Game extends Scene {
    // Существующие свойства
    private pile_hit: number = 5;
    private canHitPile: boolean = true;
    private soundtrack: Phaser.Sound.BaseSound;

    // Свойства для слайд-шоу
    private slides: Phaser.GameObjects.Image[] = [];
    private slidesContainer: Phaser.GameObjects.Container;
    private currentIndex: number = 0;
    private slideshowTimer: number = 0;
    private slideChangeInterval: number = 1000;

    // Дополнительные свойства
    private background: Phaser.GameObjects.Image;
    private player: Player;
    private enemy: Enemy;
    private pile: Phaser.GameObjects.Image;
    private msg_text: Phaser.GameObjects.Text;

    // Ссылки на изображения ebalo
    private ebaloImages: Phaser.GameObjects.Image[] = [];

    constructor() {
        super('Game');
    }

    create() {
        // Существующий код создания
        this.sound.setVolume(0.1);

        this.background = this.add.image(0, 0, 'game-background');
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.background.setDepth(-1);

        this.soundtrack = this.sound.add('sountrack');
        this.soundtrack.play({ loop: true, volume: 0.1 });

        this.pile = this.add.image(Phaser.Math.Between(0, this.cameras.main.width), Phaser.Math.Between(0, this.cameras.main.height), 'pile');
        this.pile.setScale(0.25);
        this.pile.setDepth(1);

        this.player = new Player(this, this.cameras.main.width + 100, this.cameras.main.height - 150);

        this.enemy = new Enemy(this, this.cameras.main.width - 100, this.cameras.main.height - 100, this.player);

        // Слушаем событие атаки врага
        this.player.on('enemyAttack', () => {
            this.player.handleEnemyAttack();
        });

        // Слушаем событие атаки игрока
        this.player.on('playerAttack', () => {
            const bangPos = this.player.getBangPosition();
            const distance = Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, bangPos.x, bangPos.y);
            if (distance <= 100) {
                this.enemy.handlePlayerAttack();
            }
        });

        // Слушаем событие смерти игрока
        this.player.on('playerDead', () => {
            this.scene.start('GameOver');
        });

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });

        // Добавление текста для сообщения о разрушении кучи (изначально невидимый)
        this.msg_text = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'PILE DESTROYED', {
            fontSize: '64px',
            color: '#ff0000'
        });
        this.msg_text.setOrigin(0.5);
        this.msg_text.setDepth(5);
        this.msg_text.setVisible(false);

        // Удаляем настройку слайд-шоу
        // this.setupSlideshow();
    }

    update(time: number, delta: number) {
        // Обновление врага и игрока
        this.enemy.update(time, delta);
        this.player.update(delta, {
            minX: 0,
            maxX: this.cameras.main.width,
            minY: 0,
            maxY: this.cameras.main.height
        });

        // Удаляем обработку попаданий по куче
        // const bangAppeared = this.player.getBangPosition().x !== undefined; // Упрощенная проверка
        // if (bangAppeed && this.canHitPile) {
        //     const bangPos = this.player.getBangPosition();
        //     if (
        //         (bangPos.x - 100 <= this.pile.x && this.pile.x <= bangPos.x + 100) &&
        //         (bangPos.y - 100 <= this.pile.y && this.pile.y <= bangPos.y + 100)
        //     ) {
        //         this.pile_hit--;
        //         this.canHitPile = false;

        //         if (this.pile_hit <= 0) {
        //             this.pile.setVisible(false);
        //             this.msg_text.setVisible(true);
        //         }
        //     }
        // } else if (!bangAppeared) {
        //     this.canHitPile = true;
        // }

        // Удаляем обновление слайд-шоу
        // this.slideshowTimer += delta;
        // if (this.slideshowTimer >= this.slideChangeInterval) {
        //     this.changeSlide();
        //     this.slideshowTimer = 0;
        // }
    }

    // Удаляем метод setupSlideshow
    // private setupSlideshow() {
    //     const images = [
    //         'ebalo',
    //         'ebalored',
    //         'ebalodmg1',
    //         'ebalodmg2',
    //         'ebalodmg3',
    //         'ebalodead'
    //     ];

    //     this.slides = images.map(image => {
    //         const img = this.add.image(0, 0, image);
    //         img.setVisible(false);
    //         img.setScale(0.5);
    //         return img;
    //     });

    //     this.currentIndex = 0;
    //     this.slides[this.currentIndex].setVisible(true);
    //     this.slidesContainer = this.add.container(50, 50);
    //     this.slidesContainer.add(this.slides);
    // }

    // Удаляем метод changeSlide
    // changeSlide() {
    //     this.tweens.add({
    //         targets: this.slides[this.currentIndex],
    //         alpha: 0,
    //         duration: 0,
    //         onComplete: () => {
    //             this.slides[this.currentIndex].setVisible(false);
    //             this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    //             this.slides[this.currentIndex].setAlpha(1;
    //             this.slides[this.currentIndex].setVisible(true);
    //         }
    //     });
    // }
}