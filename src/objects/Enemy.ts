// src/objects/Enemy.ts
import { Scene } from 'phaser';
import { Depths } from '../main';
import { Game } from '../scenes/Game';
import { Player } from './Player';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    private readonly player: Player;
    private readonly attackRange: number = 180;
    private readonly attackCooldown: number = 1000;
    private static readonly SPRITES = [['raider', 'raider_attack'], ['raider1', 'raider_attack1']];
    private readonly bang: Phaser.GameObjects.Image;

    private readonly currentSpriteSet: string[];
    private spriteUpdateTime: number = 0;
    private readonly spriteUpdateInterval: number = 500;

    private lastAttackTime: number = 0;
    private health: number = 3;

    constructor(scene: Scene, x: number, y: number, player: Player) {
        const randomSpriteSet = Phaser.Math.RND.pick(Enemy.SPRITES);
        super(scene, x, y, randomSpriteSet[0]);
        scene.physics.add.existing(this);
        this.currentSpriteSet = randomSpriteSet;
        this.player = player;

        // Add to scene
        scene.add.existing(this);
        // Add to physics world correctly
        scene.physics.world.enable(this);

        this.setDepth(Depths.Enemy);

        this.bang = scene.add.image(x, y, 'bang');
        this.bang.setScale(0.5);
        this.bang.setAlpha(0);
        this.bang.setDepth(Depths.Enemy);

        // Set collision body size
        this.body?.setSize(this.width, this.height);
    }

    update(time: number, delta: number) {
        if (!this.visible) return;

        if (time > this.spriteUpdateTime) {
            const currentTexture = this.texture.key;
            const nextTexture = currentTexture === this.currentSpriteSet[0]
                ? this.currentSpriteSet[1]
                : this.currentSpriteSet[0];

            this.setTexture(nextTexture);
            this.spriteUpdateTime = time + this.spriteUpdateInterval;
        }

        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);

        // Only move if not too close to player
        if (distance > this.attackRange / 2) {
            this.scene.physics.moveToObject(this, this.player, 150);
        } else {
            this.body?.velocity.set(0);
        }

        this.setFlipX(this.x < this.player.x);

        if (distance <= this.attackRange && time >= this.lastAttackTime + this.attackCooldown) {
            this.attack();
            this.lastAttackTime = time;
        }

        // Update bang effect position
        this.bang.x = this.x;
        this.bang.y = this.y;
    }

    private attack() {
        if (!this.visible) return;  // Don't attack if dead

        if (this.player instanceof Player) {
            this.player.handleEnemyAttack();
        }

        // Show attack effect
        this.bang.setAlpha(1);
        this.scene.time.delayedCall(100, () => {
            this.bang.setAlpha(0);
        });
    }

    hit(): boolean {
        this.health--;
        if (this.health <= 0) {
            const index = (this.scene as Game).enemies.indexOf(this);
            if (index > -1) {
                (this.scene as Game).enemies.splice(index, 1);
            }
            this.bang.destroy();
            this.destroy();
            return true;
        }
        return false;
    }

    getPosition(): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }
}
