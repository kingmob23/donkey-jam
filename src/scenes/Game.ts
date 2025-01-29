// src/scenes/Game.ts
import { Scene } from 'phaser';
import { Enemy } from '../objects/Enemy';
import { Pile } from '../objects/Pile';
import { Player } from '../objects/Player';

export class Game extends Scene {
    private destroyedPiles: number = 0;
    private piles: Pile[] = [];
    private items: Phaser.GameObjects.Image[] = []; // Массив для хранения предметов

    private soundtrack: Phaser.Sound.BaseSound;

    private messageTimer: number = 0;
    private readonly messageDisplayTime: number = 3000;

    private background: Phaser.GameObjects.Image;
    private player: Player;
    private enemy: Enemy;

    private msg_text: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }

    create() {
        this.sound.setVolume(0.4);

        this.background = this.add.image(0, 0, 'game-background');
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.background.setDepth(-1);

        this.soundtrack = this.sound.add('sountrack');
        this.soundtrack.play({ loop: true, volume: 0.1 });

        for (let i = 0; i < 3; i++) {
            this.piles.push(new Pile(this, {
                width: this.cameras.main.width,
                height: this.cameras.main.height
            }));
        }

        this.player = new Player(this, this.cameras.main.width + 100, this.cameras.main.height - 150);
        this.enemy = new Enemy(this, this.cameras.main.width - 100, this.cameras.main.height - 100, this.player);

        this.player.on('playerDead', () => {
            this.scene.start('GameOver');
        });

        this.msg_text = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'PILE DESTROYED', {
            fontSize: '64px',
            color: '#ff0000'
        });
        this.msg_text.setOrigin(0.5);
        this.msg_text.setDepth(5);
        this.msg_text.setVisible(false);

        // Создаем предметы на сцене
        const items = [
            { key: 'trash', x: 200, y: 300 },
            { key: 'fuel', x: 400, y: 300 },
            { key: 'wire', x: 600, y: 300 },
            { key: 'steam_pipe', x: 800, y: 300 },
            { key: 'magnet', x: 1000, y: 300 },
            { key: 'membrane', x: 1200, y: 300 },
            { key: 'amplifier', x: 1400, y: 300 }
        ];

        this.items = items.map(item => {
            const itemImage = this.add.image(item.x, item.y, item.key).setScale(0.5);
            itemImage.setInteractive(); // Делаем предмет интерактивным
            return itemImage;
        });

        // Подбор предметов по нажатию на E
        this.input.keyboard!.on('keydown-E', () => {
            this.pickUpItems();
        });
    }

    private pickUpItems() {
        const playerBounds = this.player.getBounds(); // Получаем границы игрока

        this.items.forEach((item, index) => {
            if (item.active) { // Проверяем, активен ли предмет
                const itemBounds = item.getBounds(); // Получаем границы предмета

                // Проверяем коллизию между игроком и предметом
                if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, itemBounds)) {
                    this.player.addItemToInventory(item.texture.key); // Добавляем предмет в инвентарь
                    item.destroy(); // Удаляем предмет с экрана
                    this.items.splice(index, 1); // Удаляем предмет из массива
                    console.log(`Picked up: ${item.texture.key}`);
                }
            }
        });
    }

    private getRandomItemKey(): string {
        const items = ['trash', 'fuel', 'wire', 'steam_pipe', 'magnet', 'membrane', 'amplifier'];
        return items[Math.floor(Math.random() * items.length)];
    }

    update(time: number, delta: number) {
        const bounds = {
            minX: 0,
            maxX: this.cameras.main.width,
            minY: 0,
            maxY: this.cameras.main.height
        };

        // Update player and check if bang appeared
        const bangAppeared = this.player.update(delta, bounds);
        this.enemy.update(time, delta);

        // Handle hits only when bang appears
        if (bangAppeared) {
            const bangPos = this.player.getBangPosition();

            // Check piles
            this.piles.forEach(pile => {
                if (pile.isVisible()) {
                    const pilePos = pile.getPosition();
                    if ((bangPos.x - 100 <= pilePos.x && pilePos.x <= bangPos.x + 100) &&
                        (bangPos.y - 100 <= pilePos.y && pilePos.y <= bangPos.y + 100)
                    ) {
                        if (pile.hit()) {
                            this.destroyedPiles++;
                            this.msg_text.setText(`PILE DESTROYED ${this.destroyedPiles}`);
                            this.msg_text.setVisible(true);
                            this.msg_text.setAlpha(1);
                            this.messageTimer = 0;
                        }
                    }
                }
            });

            // Check enemy
            if (this.enemy.visible) {
                const enemyPos = this.enemy.getPosition();
                if ((bangPos.x - 100 <= enemyPos.x && enemyPos.x <= bangPos.x + 100) &&
                    (bangPos.y - 100 <= enemyPos.y && enemyPos.y <= bangPos.y + 100)
                ) {
                    if (this.enemy.hit()) {
                        this.msg_text.setText('ENEMY DESTROYED');
                        this.msg_text.setVisible(true);
                        this.msg_text.setAlpha(1);
                        this.messageTimer = 0;
                    }
                }
            }
        }

        // Handle message fade out
        if (this.msg_text.visible) {
            this.messageTimer += delta;
            if (this.messageTimer >= this.messageDisplayTime) {
                this.msg_text.setVisible(false);
            } else if (this.messageTimer >= this.messageDisplayTime - 1000) {
                const alpha = 1 - (this.messageTimer - (this.messageDisplayTime - 1000)) / 1000;
                this.msg_text.setAlpha(alpha);
            }
        }
    }
}