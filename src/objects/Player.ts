// src/objects/Player.ts
import { Scene } from 'phaser';
import { MonkeyState } from './MonkeyState';

export class Player extends Phaser.GameObjects.Image {
    private speed: number = 300;
    private shot: Phaser.Sound.BaseSound;
    private bang: Phaser.GameObjects.Image;
    private ak: Phaser.GameObjects.Image;

    private flashInterval: number = 200;
    private flashTimer: number = 0;

    private canHitEnemy: boolean = true;
    private monkeyState: MonkeyState;
    private hitCount: number = 0;
    private maxHitsBeforeDeath: number = 5;

    private inventory: string[]; // Массив для хранения предметов

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        this.setScale(0.3);
        this.setDepth(0);
        scene.add.existing(this);

        this.bang = scene.add.image(this.x, this.y, 'bang');
        this.bang.setScale(0.3);
        this.bang.setAlpha(0);
        this.bang.setDepth(4);

        this.ak = scene.add.image(this.x - 300, this.y, 'ak');
        this.ak.setScale(0.7);
        this.ak.setDepth(1);

        this.shot = scene.sound.add('shot');

        this.monkeyState = new MonkeyState(scene, 80, 80);

        this.inventory = []; // Инициализация инвентаря
    }

    update(delta: number, bounds: { minX: number, maxX: number, minY: number, maxY: number }): boolean {
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
        this.printInventory(); // Выводим инвентарь в консоль
    }

    // Метод для отображения инвентаря в консоли
    public printInventory(): void {
        console.log("Player's Inventory:", this.inventory.join(', '));
    }

    // Метод для получения инвентаря
    public getInventory(): string[] {
        return this.inventory;
    }

    // Метод для подбора предметов
    private pickUpItems() {
        const playerBounds = this.getBounds(); // Получаем границы игрока

        // Получаем все предметы на сцене
        const items = this.scene.children.getChildren().filter(child => {
            return child instanceof Phaser.GameObjects.Image && 
                   ['trash', 'fuel', 'wire', 'steam_pipe', 'magnet', 'membrane', 'amplifier'].includes(child.texture.key);
        }) as Phaser.GameObjects.Image[];

        items.forEach(item => {
            if (item.active) { // Проверяем, активен ли предмет
                const itemBounds = item.getBounds(); // Получаем границы предмета

                // Проверяем коллизию между игроком и предметом
                if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, itemBounds)) {
                    this.addItemToInventory(item.texture.key); // Добавляем предмет в инвентарь
                    item.destroy(); // Удаляем предмет с экрана
                    console.log(`Picked up: ${item.texture.key}`);
                }
            }
        });
    }
}