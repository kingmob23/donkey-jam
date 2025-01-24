import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    soundtrack: Phaser.Sound.BaseSound;
    msg_text : Phaser.GameObjects.Text;
    player: Phaser.GameObjects.Image;
    bang: Phaser.GameObjects.Image;
    ak: Phaser.GameObjects.Image;
    second_dude: Phaser.GameObjects.Image;

    private shot: Phaser.Sound.BaseSound;
    private flashTimer: number = 0;
    private readonly flashInterval: number = 50; // Adjust this value to control flash speed

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private spacebar: Phaser.Input.Keyboard.Key;

    private readonly playerSpeed: number = 300;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;

        this.background = this.add.image(0, 0, 'game-background');
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.soundtrack = this.sound.add('sountrack');
        this.soundtrack.play({ loop: true, volume: 0.1 });

        this.player = this.add.image(this.cameras.main.width + 100, this.cameras.main.height - 150, 'player');
        this.player.setScale(0.3);
        this.ak = this.add.image(512, 384, 'ak');
        this.ak.setScale(0.8);
        this.ak.setRotation(0.1);
        this.bang = this.add.image(this.player.x, this.player.y, 'bang');
        this.bang.setScale(0.3);
        this.bang.setAlpha(0);

        this.second_dude = this.add.image(this.cameras.main.width - 100, this.cameras.main.height - 100, 'second-dude');

        this.shot = this.sound.add('shot');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });
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
                this.bang.setAlpha(this.bang.alpha === 0 ? 1 : 0);
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
        }
    }
}
