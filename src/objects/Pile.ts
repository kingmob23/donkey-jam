import { Scene } from 'phaser';
import { Depths } from '../main';
type PileDrop = 'trash' | 'fuel' | 'wire' | 'steam_pipe' | 'magnet' | 'membrane' | 'amplifier';

export class Pile {
    private readonly sprite: Phaser.GameObjects.Image;
    private dropSprite: Phaser.GameObjects.Image | null = null;
    private health: number = 3;
    private static readonly SPRITES = ['pile'];
    private static readonly DROPS: PileDrop[] = ['trash', 'fuel', 'wire', 'steam_pipe', 'magnet', 'membrane', 'amplifier'];
    private readonly drop: PileDrop;

    constructor(scene: Scene, bounds: { width: number, height: number }) {
        const randomSprite = Phaser.Math.RND.pick(Pile.SPRITES);
        const x = Phaser.Math.Between(0, bounds.width);
        const y = Phaser.Math.Between(350, bounds.height - 160);

        this.sprite = scene.add.image(x, y, randomSprite);
        this.sprite.setScale(0.4);

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
            this.dropSprite.setDepth(Depths.Player - 1);
            this.dropSprite.setScale(0.7);
            this.dropSprite.setName(this.drop);
            this.dropSprite.setVisible(true);
            this.dropSprite.setActive(true);
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

    getDroppedItem(): Phaser.GameObjects.Image | null {
        return this.dropSprite;
    }

    update(playerY: number): void {
        const depth = playerY >= this.sprite.y - 130 ? Depths.Piles : Depths.Player + 1;
        this.sprite.setDepth(depth);
        if (this.dropSprite) {
            this.dropSprite.setDepth(depth);
        }
    }
}