import { Scene } from 'phaser';
import { Depths } from '../main';
export class MonkeyState {
    private static readonly STATES = {
        HEALTHY: 0,
        OWTCH1: 1,
        OWTCH2: 2,
        OWTCH3: 3,
        DEAD: 4
    } as const;

    private currentState: number = MonkeyState.STATES.HEALTHY;
    private sprites: Phaser.GameObjects.Image[] = [];
    private circle: Phaser.GameObjects.Graphics;
    private readonly CIRCLE_RADIUS = 88;

    private drawCircle(x: number, y: number): void {
        this.circle.clear();
        this.circle.fillStyle(0xb85149);
        this.circle.beginPath();
        this.circle.arc(x, y, this.CIRCLE_RADIUS, 0, Math.PI * 2);
        this.circle.closePath();
        this.circle.fillPath();
    }

    constructor(scene: Scene, x: number, y: number) {
        this.circle = scene.add.graphics();
        this.circle.setDepth(Depths.UI);

        this.drawCircle(x, y);

        const stateSprites = [
            { key: 'healthy', state: MonkeyState.STATES.HEALTHY },
            { key: 'owtch1', state: MonkeyState.STATES.OWTCH1 },
            { key: 'owtch2', state: MonkeyState.STATES.OWTCH2 },
            { key: 'owtch3', state: MonkeyState.STATES.OWTCH3 },
            { key: 'dead', state: MonkeyState.STATES.DEAD }
        ];

        stateSprites.forEach(({ key }) => {
            const sprite = scene.add.image(x, y, key);
            sprite.setScale(0.7);
            sprite.setDepth(Depths.UI);
            sprite.setVisible(false);
            this.sprites.push(sprite);
        });

        this.sprites[this.currentState].setVisible(true);
    }

    nextState(): boolean {
        this.sprites[this.currentState].setVisible(false);

        if (this.currentState === MonkeyState.STATES.DEAD) {
            return true;
        }

        this.currentState++;
        this.sprites[this.currentState].setVisible(true);

        return this.currentState === MonkeyState.STATES.DEAD;
    }

    isDead(): boolean {
        return this.currentState === MonkeyState.STATES.DEAD;
    }

    setPosition(x: number, y: number): void {
        this.drawCircle(x, y);

        this.sprites.forEach(sprite => {
            sprite.setPosition(x, y);
        });
    }
}