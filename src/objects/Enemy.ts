// src/objects/Enemy.ts
import { Scene } from 'phaser';
import { Player } from './Player';

export class Enemy extends Phaser.GameObjects.Image {
    private readonly player: Phaser.GameObjects.Image;
    private readonly speed: number = 60;
    private readonly attackRange: number = 100;
    private readonly attackCooldown: number = 2000;
    private readonly bang: Phaser.GameObjects.Image;

    private lastAttackTime: number = 0;
    private health: number = 3;

    constructor(scene: Scene, x: number, y: number, player: Player) {
        super(scene, x, y, 'raider');
        this.player = player;

        this.setDepth(2);
        scene.add.existing(this);

        // Setup attack effect
        this.bang = scene.add.image(x, y, 'bang');
        this.bang.setScale(0.5);
        this.bang.setAlpha(0);
        this.bang.setDepth(1);
    }

    update(time: number, delta: number) {
        if (!this.visible) return;  // Skip update if dead

        // Move towards player
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);

        if (distance > 5) {
            const angle = Math.atan2(dy, dx);
            const vx = Math.cos(angle) * this.speed * (delta / 1000);
            const vy = Math.sin(angle) * this.speed * (delta / 1000);
            this.x += vx;
            this.y += vy;
        }

        // Attack if in range
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

        // Call handleEnemyAttack directly instead of emitting event
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
            this.setVisible(false);
            this.bang.destroy();
            return true;
        }
        return false;
    }

    getPosition(): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }
}
