import { Scene } from 'phaser';

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

    constructor(scene: Scene, x: number, y: number) {
        const stateSprites = [
            { key: 'healthy', state: MonkeyState.STATES.HEALTHY },
            { key: 'owtch1', state: MonkeyState.STATES.OWTCH1 },
            { key: 'owtch2', state: MonkeyState.STATES.OWTCH2 },
            { key: 'owtch3', state: MonkeyState.STATES.OWTCH3 },
            { key: 'dead', state: MonkeyState.STATES.DEAD }
        ];

        stateSprites.forEach(({ key }) => {
            const sprite = scene.add.image(x, y, key);
            sprite.setScale(0.5);
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
        this.sprites.forEach(sprite => {
            sprite.setPosition(x, y);
        });
    }
}