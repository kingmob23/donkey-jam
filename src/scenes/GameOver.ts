import { Scene } from 'phaser';

export class GameOver extends Scene
{
    private deadFace: Phaser.GameObjects.Image;
    private gameOverText: Phaser.GameObjects.Text;
    private flashTimer: number = 0;
    private readonly flashInterval: number = 100;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        // Create dead face at original position (same as in game)
        this.deadFace = this.add.image(80, 80, 'dead');
        this.deadFace.setScale(0.5);

        // Create game over text (initially invisible)
        this.gameOverText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 100,
            'ITS SO OVER',
            {
                fontSize: '128px',
                color: '#ff0000',
            }
        );
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setAlpha(0);

        // Animate dead face to center and scale up
        this.tweens.add({
            targets: this.deadFace,
            x: this.cameras.main.width / 2,
            y: this.cameras.main.height / 2,
            scale: Math.min(
                (this.cameras.main.width * 0.7) / this.deadFace.width,
                (this.cameras.main.height * 0.7) / this.deadFace.height
            ),
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                // Start flashing text after face animation
                this.gameOverText.setAlpha(1);
            }
        });

        // Click to restart
        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }

    update(time: number, delta: number) {
        // Flash game over text
        if (this.gameOverText.alpha > 0) {
            this.flashTimer += delta;
            if (this.flashTimer >= this.flashInterval) {
                this.gameOverText.setAlpha(this.gameOverText.alpha === 1 ? 0.3 : 1);
                this.flashTimer = 0;
            }
        }
    }
}
