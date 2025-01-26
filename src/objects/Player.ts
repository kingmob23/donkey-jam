// src/objects/Player.ts
import Phaser from 'phaser';

export class Player extends Phaser.GameObjects.Image {
    private health: number = 100; // Здоровье игрока
    private speed: number = 300;
    private flashInterval: number = 200;
    private flashTimer: number = 0;
    private shot: Phaser.Sound.BaseSound;
    private bang: Phaser.GameObjects.Image;
    private canHitEnemy: boolean = true;

    // Свойства для отслеживания ударов
    private hitCount: number = 0;
    private maxHitsBeforeDeath: number = 5;

    // Ссылки на изображения ebalo
    private ebaloImages: Phaser.GameObjects.Image[];
    private currentEbaloIndex: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, ebaloImages: Phaser.GameObjects.Image[]) {
        super(scene, x, y, 'player');
        this.setScale(0.3);
        this.setDepth(2);
        scene.add.existing(this);

        this.bang = scene.add.image(this.x, this.y, 'bang');
        this.bang.setScale(0.3);
        this.bang.setAlpha(0);
        this.bang.setDepth(4);
        this.shot = scene.sound.add('shot');

        this.ebaloImages = ebaloImages;
        this.currentEbaloIndex = 0;
        // Удаляем смену изображений
        // this.ebaloImages[this.currentEbaloIndex].setVisible(true);
    }

    update(delta: number, bounds: { minX: number, maxX: number, minY: number, maxY: number }) {
        // Обработка движения игрока
        if (this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT).isDown) {
            const newX = this.x - this.speed * delta / 1000;
            if (newX >= bounds.minX) {
                this.x = newX;
            }
        }
        if (this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT).isDown) {
            const newX = this.x + this.speed * delta / 1000;
            if (newX <= bounds.maxX) {
                this.x = newX;
            }
        }
        if (this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP).isDown) {
            const newY = this.y - this.speed * delta / 1000;
            if (newY >= bounds.minY) {
                this.y = newY;
            }
        }
        if (this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN).isDown) {
            const newY = this.y + this.speed * delta / 1000;
            if (newY <= bounds.maxY) {
                this.y = newY;
            }
        }

        // Обновление позиции bang
        this.bang.x = this.x - 200;
        this.bang.y = this.y - 40;

        // Удаляем смену изображений
        // this.changeEbaloImage();
    }

    public getBangPosition(): { x: number, y: number } {
        return { x: this.x - 200, y: this.y - 40 };
    }

    public handleEnemyAttack() {
        // Обработка атаки врага
        this.hitCount++;
        if (this.hitCount >= this.maxHitsBeforeDeath) {
            this.die();
        }
        // Удаляем смену изображений
        // else {
        //     this.changeEbaloImage();
        // }
    }

    private die() {
        // Логика смерти игрока
        this.setVisible(false);
        this.emit('playerDead');
    }

    // Удаляем метод changeEbaloImage
    // private changeEbaloImage() {
    //     // Изменение изображения ebalo
    //     this.ebaloImages[this.currentEbaloIndex].setVisible(false);
    //     this.currentEbaloIndex = (this.currentEbaloIndex + 1) % this.ebaloImages.length;
    //     this.ebaloImages[this.currentEbaloIndex].setVisible(true);
    // }
}