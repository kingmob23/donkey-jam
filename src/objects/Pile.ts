import { Scene } from 'phaser';

export class Pile {
    private sprite: Phaser.GameObjects.Image;
    private health: number = 3;
    private static readonly SPRITES = ['pile', 'pile2', 'pile3'];

    constructor(scene: Scene, bounds: { width: number, height: number }) {
        const randomSprite = Phaser.Math.RND.pick(Pile.SPRITES);
        const x = Phaser.Math.Between(0, bounds.width - 100);
        const y = Phaser.Math.Between(0, bounds.height);

        this.sprite = scene.add.image(x, y, randomSprite);
        this.sprite.setScale(0.2);
        this.sprite.setDepth(1);
    }

    hit(): boolean {
        this.health--;
        if (this.health <= 0) {
            this.sprite.setVisible(false);
            return true;
        }
        return false;
    }

    isVisible(): boolean {
        return this.sprite.visible;
    }

    getPosition(): { x: number, y: number } {
        return { x: this.sprite.x, y: this.sprite.y };
    }
}