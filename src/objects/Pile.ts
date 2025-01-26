import { Scene } from 'phaser';

type PileDrop = 'trash' | 'fuel' | 'wire' | 'steam_pipe' | 'magnet' | 'membrane' | 'amplifier';

export class Pile {
    private readonly sprite: Phaser.GameObjects.Image;
    private dropSprite: Phaser.GameObjects.Image | null = null;
    private health: number = 3;
    private static readonly SPRITES = ['pile', 'pile1', 'pile2'];
    private static readonly DROPS: PileDrop[] = ['trash', 'fuel', 'wire', 'steam_pipe', 'magnet', 'membrane', 'amplifier'];
    private readonly drop: PileDrop;

    constructor(scene: Scene, bounds: { width: number, height: number }) {
        const randomSprite = Phaser.Math.RND.pick(Pile.SPRITES);
        const x = Phaser.Math.Between(0, bounds.width - 100);
        const y = Phaser.Math.Between(0, bounds.height);

        this.sprite = scene.add.image(x, y, randomSprite);
        this.sprite.setScale(0.2);
        this.sprite.setDepth(1);

        this.drop = Phaser.Math.RND.pick(Pile.DROPS);
    }

    hit(): boolean {
        this.health--;
        if (this.health <= 0) {
            this.sprite.setVisible(false);
            this.showDrop();
            return true;
        }
        return false;
    }

    private showDrop(): void {
        if (!this.dropSprite) {
            const { x, y } = this.getPosition();
            this.dropSprite = this.sprite.scene.add.image(x, y, this.drop);
            this.dropSprite.setScale(0.15);
            this.dropSprite.setDepth(1);
        }
    }

    isVisible(): boolean {
        return this.sprite.visible;
    }

    getPosition(): { x: number, y: number } {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    getDrop(): PileDrop {
        return this.drop;
    }
}