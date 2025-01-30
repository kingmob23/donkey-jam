import { Scene } from 'phaser';
import { Depths } from '../main';
import { Enemy } from '../objects/Enemy';
import { Pile } from '../objects/Pile';
import { Player } from '../objects/Player';

export class Game extends Scene {
    enemies: Enemy[] = [];

    private destroyedPiles: number = 0;
    private readonly piles: Pile[] = [];

    private soundtrack: Phaser.Sound.BaseSound;

    private messageTimer: number = 0;
    private readonly messageDisplayTime: number = 3000;

    private background: Phaser.GameObjects.Image;
    private foreground: Phaser.GameObjects.Image;
    private midground: Phaser.GameObjects.Image;

    private player: Player;

    private msg_text: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }

    create() {
        this.sound.setVolume(0.4);

        this.background = this.add.image(1920 / 2, 1080 - 839 / 2, 'background');
        this.background.setDepth(Depths.Background);

        this.midground = this.add.image(1920 / 2, 1080 - 766 / 2, 'midground');
        this.midground.setDepth(Depths.Midground);

        this.foreground = this.add.image(1920 / 2, 1080 - 159 / 2, 'foreground');
        this.foreground.setDepth(Depths.Foreground);

        this.soundtrack = this.sound.add('sountrack');
        this.soundtrack.play({ loop: true, volume: 0.1 });

        for (let i = 0; i < 10; i++) {
            this.piles.push(new Pile(this, {
                width: this.cameras.main.width,
                height: this.cameras.main.height
            }));
        }

        this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height / 2);

        this.enemies.push(new Enemy(this, Phaser.Math.Between(0, this.cameras.main.width), Phaser.Math.Between(0, this.cameras.main.height), this.player));

        this.player.on('playerDead', () => {
            this.scene.start('GameOver');
        });

        this.msg_text = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'PILE DESTROYED', {
            fontSize: '64px',
            color: '#ff0000'
        });
        this.msg_text.setOrigin(0.5);
        this.msg_text.setDepth(Depths.Text);
        this.msg_text.setVisible(false);

        this.time.addEvent({
            delay: 30000,
            callback: () => {
                const enemy = new Enemy(this, Phaser.Math.Between(0, this.cameras.main.width),
                    Phaser.Math.Between(0, this.cameras.main.height), this.player);
                this.enemies.push(enemy);
                this.physics.add.collider(this.player, enemy);
            },
            loop: true
        });

        this.enemies.forEach(enemy => {
            this.physics.add.collider(this.player, enemy);
        });
    }

    update(time: number, delta: number) {
        this.piles.forEach(pile => pile.update(this.player.y));

        const bounds = {
            minX: 50,
            maxX: this.cameras.main.width - 50,
            minY: 50,
            maxY: this.cameras.main.height - 150
        };

        // Update player and check if bang appeared
        const bangAppeared = this.player.update(delta, bounds);
        this.enemies.forEach(enemy => enemy.update(time, delta));

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

            this.enemies.forEach(enemy => {
                if (enemy.visible) {
                    const enemyPos = enemy.getPosition();
                    if ((bangPos.x - 100 <= enemyPos.x && enemyPos.x <= bangPos.x + 100) &&
                        (bangPos.y - 100 <= enemyPos.y && enemyPos.y <= bangPos.y + 100)
                    ) {
                        if (enemy.hit()) {
                            this.msg_text.setText('ENEMY DESTROYED');
                            this.msg_text.setVisible(true);
                            this.msg_text.setAlpha(1);
                            this.messageTimer = 0;
                        }
                    }
                }
            });
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