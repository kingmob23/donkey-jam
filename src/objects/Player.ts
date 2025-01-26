import { Scene } from 'phaser';

export class Player {
    private readonly flashInterval: number = 200;
    private flashTimer: number = 0;

    private speed: number = 300;
    private sprite: Phaser.GameObjects.Image;
    private ak: Phaser.GameObjects.Image;
    private bang: Phaser.GameObjects.Image;
    private shot: Phaser.Sound.BaseSound;

    private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private readonly spacebar: Phaser.Input.Keyboard.Key;

    constructor(scene: Scene, x: number, y: number) {
        // Create player and its equipment
        this.sprite = scene.add.image(x, y, 'player');
        this.sprite.setScale(0.3);
        this.sprite.setDepth(2);

        this.ak = scene.add.image(x, y, 'ak');
        this.ak.setScale(0.8);
        this.ak.setRotation(0.1);
        this.ak.setDepth(3);

        this.bang = scene.add.image(x, y, 'bang');
        this.bang.setScale(0.3);
        this.bang.setAlpha(0);
        this.bang.setDepth(4);

        // Setup controls
        this.cursors = scene.input.keyboard!.createCursorKeys();
        this.spacebar = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Setup sound
        this.shot = scene.sound.add('shot');
    }

    update(delta: number, bounds: { minX: number, maxX: number, minY: number, maxY: number }): boolean {
        // Handle movement
        if (this.cursors.left.isDown) {
            const newX = this.sprite.x - this.speed * delta / 1000;
            if (newX >= bounds.minX) {
                this.sprite.x = newX;
            }
        } else if (this.cursors.right.isDown) {
            const newX = this.sprite.x + this.speed * delta / 1000;
            if (newX <= bounds.maxX) {
                this.sprite.x = newX;
            }
        }

        if (this.cursors.up.isDown) {
            const newY = this.sprite.y - this.speed * delta / 1000;
            if (newY >= bounds.minY) {
                this.sprite.y = newY;
            }
        } else if (this.cursors.down.isDown) {
            const newY = this.sprite.y + this.speed * delta / 1000;
            if (newY <= bounds.maxY) {
                this.sprite.y = newY;
            }
        }

        // Update equipment positions
        this.ak.x = this.sprite.x - 50;
        this.ak.y = this.sprite.y + 10;

        this.bang.x = this.sprite.x - 200;
        this.bang.y = this.sprite.y - 40;

        // Handle shooting
        if (this.spacebar.isDown) {
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
                return newAlpha === 1; // Return true when bang appears
            }
        } else {
            if (this.shot.isPlaying) {
                this.shot.pause();
            }
            this.bang.setAlpha(0);
            this.flashTimer = 0;
        }

        return false;
    }

    // Getters for position and bang position (useful for collision detection)
    getBangPosition(): { x: number, y: number } {
        return { x: this.bang.x, y: this.bang.y };
    }

    getPosition(): { x: number, y: number } {
        return { x: this.sprite.x, y: this.sprite.y };
    }
}
