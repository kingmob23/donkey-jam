// src/objects/Player.ts
import { Scene } from 'phaser';
import { Depths } from '../main';
import { MonkeyState } from './MonkeyState';

export class Player extends Phaser.Physics.Arcade.Sprite {
    private speed: number = 300;
    private flashInterval: number = 200;
    private flashTimer: number = 0;

    private readonly shot: Phaser.Sound.BaseSound;
    private readonly bang: Phaser.GameObjects.Image;
    private readonly ak: Phaser.GameObjects.Image;

    private readonly monkeyState: MonkeyState;

    private inventory: string[]; // Массив для хранения предметов

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        scene.physics.add.existing(this);
        this.setScale(0.4);
        this.setDepth(Depths.Player);
        scene.add.existing(this);

        // Set collision body size
        this.body?.setSize(this.width, this.height);

        this.ak = scene.add.image(this.x - 300, this.y, 'ak');

        this.ak.setDepth(Depths.Player);

        this.bang = scene.add.image(this.x, this.y, 'bang');
        this.bang.setScale(0.3);
        this.bang.setAlpha(0);
        this.bang.setDepth(Depths.Player);

        this.shot = scene.sound.add('shot');

        this.monkeyState = new MonkeyState(scene, 100, scene.cameras.main.height - 100);


        this.inventory = []; // Инициализация инвентаря
    }

    update(delta: number, bounds: { minX: number, maxX: number, minY: number, maxY: number }): boolean {
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0);

        if (this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT).isDown) {
            body.setVelocityX(-this.speed);
            this.flipX=false
        }
        if (this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT).isDown) {
            body.setVelocityX(this.speed);
            this.flipX=true
        }
        if (this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP).isDown) {
            body.setVelocityY(-this.speed);
        }
        if (this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN).isDown) {
            body.setVelocityY(this.speed);
        }

        body.setCollideWorldBounds(true);

        this.ak.x = this.x - 50;
        this.ak.y = this.y + 10;

        this.bang.x = this.x - 200;
        this.bang.y = this.y - 20;

        const spacebar = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        if (spacebar.isDown) {
            if (!this.shot.isPlaying) {
                this.shot.play({ volume: 0.3 });
            } else {
                this.shot.resume();
            }

            this.flashTimer += delta;
            if (this.flashTimer >= this.flashInterval) {
                const newAlpha = this.bang.alpha === 0 ? 1 : 0;
                this.bang.setAlpha(newAlpha);
                this.flashTimer = 0;
                return newAlpha === 1;
            }
        } else {
            if (this.shot.isPlaying) {
                this.shot.pause();
            }
            this.bang.setAlpha(0);
            this.flashTimer = 0;
        }

        // Подбор предметов по нажатию на E
        const eKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        if (eKey.isDown) {
            this.pickUpItems();
        }

        return false;
    }

    public getBangPosition(): { x: number, y: number } {
        return { x: this.bang.x, y: this.bang.y };
    }

    public handleEnemyAttack() {
        if (this.monkeyState.nextState()) {
            // Player is dead
            this.setVisible(false);
            this.bang.setVisible(false);
            this.ak.setVisible(false);
            this.shot.stop();  // Stop any playing sounds
            this.emit('playerDead');
        }
    }

    // Метод для добавления предмета в инвентарь
    public addItemToInventory(itemKey: string): void {
        this.inventory.push(itemKey);
        console.log(`Item added to inventory: ${itemKey}`);
        console.log("Player's Inventory:", this.inventory.join(', '));
    }

    // Метод для подбора предметов
    private pickUpItems() {
        const playerBounds = this.getBounds();
        const items = this.scene.children.getChildren().filter(child => {
            return child instanceof Phaser.GameObjects.Image
                && child.active
                && ['fuel', 'wire', 'steam_pipe', 'magnet', 'membrane', 'amplifier'].includes(child.texture?.key);
        }) as Phaser.GameObjects.Image[];

        items.forEach(item => {
            const itemBounds = item.getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, itemBounds)) {
                this.addItemToInventory(item.texture.key);
                item.destroy();
            }
        });
    }
}