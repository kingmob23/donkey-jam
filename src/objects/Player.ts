// src/objects/Player.ts
import { Scene } from 'phaser';
import { Depths } from '../main';
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

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        this.setScale(0.1);
        this.setDepth(Depths.Player);
        scene.add.existing(this);

        this.ak = scene.add.image(this.x - 300, this.y, 'ak');
        this.ak.setScale(0.7);
        this.ak.setDepth(Depths.Player);

        this.bang = scene.add.image(this.x, this.y, 'bang');
        this.bang.setScale(0.3);
        this.bang.setAlpha(0);
        this.bang.setDepth(Depths.Player);

        this.shot = scene.sound.add('shot');

        this.monkeyState = new MonkeyState(scene, 80, 80);
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
}