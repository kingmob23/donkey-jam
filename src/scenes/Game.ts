import { Scene } from 'phaser';

export class Game extends Scene
{
    // Private properties (internal state that shouldn't be accessed from outside)
    private readonly playerSpeed: number = 300;
    private readonly flashInterval: number = 200;
    private flashTimer: number = 0;
    private pile_hit: number = 5;
    private canHitPile: boolean = true;  // New flag to track if we can hit the pile
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private spacebar: Phaser.Input.Keyboard.Key;
    private shot: Phaser.Sound.BaseSound;
    private soundtrack: Phaser.Sound.BaseSound;

    // Protected properties (game objects that might need access from inherited classes)
    protected camera: Phaser.Cameras.Scene2D.Camera;
    protected background: Phaser.GameObjects.Image;
    protected player: Phaser.GameObjects.Image;
    protected bang: Phaser.GameObjects.Image;
    protected ak: Phaser.GameObjects.Image;
    protected second_dude: Phaser.GameObjects.Image;
    protected pile: Phaser.GameObjects.Image;
    protected msg_text: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.sound.setVolume(0.1);

        this.camera = this.cameras.main;

        this.background = this.add.image(0, 0, 'game-background');
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.background.setDepth(-1);

        this.soundtrack = this.sound.add('sountrack');
        this.soundtrack.play({ loop: true, volume: 0.1 });

        this.pile = this.add.image(Phaser.Math.Between(0, this.cameras.main.width), Phaser.Math.Between(0, this.cameras.main.height), 'pile');
        this.pile.setScale(0.25);
        this.pile.setDepth(1);

        this.player = this.add.image(this.cameras.main.width + 100, this.cameras.main.height - 150, 'player');
        this.player.setScale(0.3);
        this.player.setDepth(2);
        this.ak = this.add.image(512, 384, 'ak');
        this.ak.setScale(0.8);
        this.ak.setRotation(0.1);
        this.ak.setDepth(3);
        this.bang = this.add.image(this.player.x, this.player.y, 'bang');
        this.bang.setScale(0.3);
        this.bang.setAlpha(0);
        this.bang.setDepth(4);
        this.shot = this.sound.add('shot');

        this.second_dude = this.add.image(this.cameras.main.width - 100, this.cameras.main.height - 100, 'second-dude');
        this.second_dude.setDepth(2);

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.spacebar = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
    }

    update ()
    {
        const minX = 0;
        const maxX = this.cameras.main.width;
        const minY = 0;
        const maxY = this.cameras.main.height;

        if (this.cursors.left.isDown)
        {
            const newX = this.player.x - this.playerSpeed * this.game.loop.delta / 1000;
            if (newX >= minX) {
                this.player.x = newX;
            }
        }
        else if (this.cursors.right.isDown)
        {
            const newX = this.player.x + this.playerSpeed * this.game.loop.delta / 1000;
            if (newX <= maxX) {
                this.player.x = newX;
            }
        }
        if (this.cursors.up.isDown)
        {
            const newY = this.player.y - this.playerSpeed * this.game.loop.delta / 1000;
            if (newY >= minY) {
                this.player.y = newY;
            }
        }
        else if (this.cursors.down.isDown)
        {
            const newY = this.player.y + this.playerSpeed * this.game.loop.delta / 1000;
            if (newY <= maxY) {
                this.player.y = newY;
            }
        }

        this.ak.x = this.player.x - 50;
        this.ak.y = this.player.y + 10;

        this.bang.x = this.player.x - 200;
        this.bang.y = this.player.y - 40;

        if (this.spacebar.isDown)
        {
            if (!this.shot.isPlaying)
            {
                this.shot.play({ volume: 0.3 });
            }
            else
            {
                this.shot.resume();
            }

            this.flashTimer += this.game.loop.delta;
            if (this.flashTimer >= this.flashInterval) {
                const newAlpha = this.bang.alpha === 0 ? 1 : 0;
                this.bang.setAlpha(newAlpha);

                // Only check for hits when bang appears
                if (newAlpha === 1 && this.canHitPile) {
                    if ((this.bang.x - 100 <= this.pile.x && this.pile.x <= this.bang.x + 100) &&
                        (this.bang.y - 100 <= this.pile.y && this.pile.y <= this.bang.y + 100)) {
                        this.pile_hit--;
                        this.canHitPile = false;  // Prevent multiple hits until bang disappears

                        if (this.pile_hit <= 0) {
                            this.pile.setVisible(false);
                            this.msg_text.setVisible(true);
                        }
                    }
                } else if (newAlpha === 0) {
                    this.canHitPile = true;  // Reset flag when bang disappears
                }

                this.flashTimer = 0;
            }
        }
        else
        {
            if (this.shot.isPlaying)
            {
                this.shot.pause();
            }
            this.bang.setAlpha(0);
            this.flashTimer = 0;
            this.canHitPile = true;  // Reset flag when spacebar is released
        }
    }
}
