import { Scene } from 'phaser';
import { Player } from '../objects/Player';

export class Game extends Scene {
    private pile_hit: number = 5;
    private canHitPile: boolean = true;
    private soundtrack: Phaser.Sound.BaseSound;
    private messageTimer: number = 0;
    private readonly messageDisplayTime: number = 3000;
    private destroyedPiles: number = 0;

    // Slideshow properties
    private slides: Phaser.GameObjects.Image[] = [];
    private slidesContainer: Phaser.GameObjects.Container;
    private currentIndex: number = 0;
    private slideshowTimer: number = 0;
    private slideChangeInterval: number = 1000;

    private background: Phaser.GameObjects.Image;
    private player: Player;
    private enemy: Phaser.GameObjects.Image;
    private piles: Phaser.GameObjects.Image[] = [];
    private msg_text: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }

    create() {
        // Existing create code
        this.sound.setVolume(0.1);

        this.background = this.add.image(0, 0, 'game-background');
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.background.setDepth(-1);

        this.soundtrack = this.sound.add('sountrack');
        this.soundtrack.play({ loop: true, volume: 0.1 });

        this.piles = [
            this.add.image(Phaser.Math.Between(0, this.cameras.main.width), Phaser.Math.Between(0, this.cameras.main.height), 'pile'),
            this.add.image(Phaser.Math.Between(0, this.cameras.main.width), Phaser.Math.Between(0, this.cameras.main.height), 'pile2'),
            this.add.image(Phaser.Math.Between(0, this.cameras.main.width), Phaser.Math.Between(0, this.cameras.main.height), 'pile3')
        ];
        this.piles.forEach(pile => {
            pile.setScale(0.25);
            pile.setDepth(1);
        });

        this.player = new Player(
            this,
            this.cameras.main.width + 100,
            this.cameras.main.height - 150
        );

        this.enemy = this.add.image(this.cameras.main.width - 100, this.cameras.main.height - 100, 'enemy');
        this.enemy.setDepth(2);

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });

        // Add text for pile destroyed message (initially invisible)
        this.msg_text = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'PILE DESTROYED', {
            fontSize: '64px',
            color: '#ff0000'
        });
        this.msg_text.setOrigin(0.5);
        this.msg_text.setDepth(5);
        this.msg_text.setVisible(false);

        // Slideshow setup in upper left corner
        this.setupSlideshow();
    }

    update(time: number, delta: number) {
        const bounds = {
            minX: 0,
            maxX: this.cameras.main.width,
            minY: 0,
            maxY: this.cameras.main.height
        };

        const bangAppeared = this.player.update(delta, bounds);

        // Handle pile hits when bang appears
        if (bangAppeared && this.canHitPile) {
            const bangPos = this.player.getBangPosition();

            // Check each pile for hits
            this.piles.forEach((pile, _) => {
                if (pile.visible &&
                    (bangPos.x - 100 <= pile.x && pile.x <= bangPos.x + 100) &&
                    (bangPos.y - 100 <= pile.y && pile.y <= bangPos.y + 100)
                ) {
                    pile.setVisible(false);
                    this.destroyedPiles++;
                    this.msg_text.setText(`PILE DESTROYED ${this.destroyedPiles}`);
                    this.msg_text.setVisible(true);
                    this.msg_text.setAlpha(1);
                    this.messageTimer = 0;
                }
            });
            this.canHitPile = false;
        } else if (!bangAppeared) {
            this.canHitPile = true;
        }

        // Handle message fade out
        if (this.msg_text.visible) {
            this.messageTimer += delta;
            if (this.messageTimer >= this.messageDisplayTime) {
                this.msg_text.setVisible(false);
            } else if (this.messageTimer >= this.messageDisplayTime - 1000) {
                // Start fading out during the last second
                const alpha = 1 - (this.messageTimer - (this.messageDisplayTime - 1000)) / 1000;
                this.msg_text.setAlpha(alpha);
            }
        }

        // Update slideshow
        this.slideshowTimer += delta;
        if (this.slideshowTimer >= this.slideChangeInterval) {
            this.changeSlide();
            this.slideshowTimer = 0;
        }
    }

    private setupSlideshow() {
        const images = [
            'ebalo',
            'ebalored',
            'ebalodmg1',
            'ebalodmg2',
            'ebalodmg3',
            'ebalodead'
        ];

        this.slides = images.map(image => {
            const img = this.add.image(0, 0, image);
            img.setVisible(false);
            img.setScale(0.5);
            return img;
        });

        this.currentIndex = 0;
        this.slides[this.currentIndex].setVisible(true);
        this.slidesContainer = this.add.container(50, 50);
        this.slidesContainer.add(this.slides);
    }

    changeSlide() {
        this.tweens.add({
            targets: this.slides[this.currentIndex],
            alpha: 0,
            duration: 0,
            onComplete: () => {
                this.slides[this.currentIndex].setVisible(false);
                this.currentIndex = (this.currentIndex + 1) % this.slides.length;
                this.slides[this.currentIndex].setAlpha(1);
                this.slides[this.currentIndex].setVisible(true);
            }
        });
    }
}