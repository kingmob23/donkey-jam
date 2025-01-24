import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    player: Phaser.GameObjects.Image;
    shot_effect: Phaser.GameObjects.Image;
    ak: Phaser.GameObjects.Image;
    second_dude: Phaser.GameObjects.Image;

    private shot: Phaser.Sound.BaseSound;

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

        this.player = this.add.image(512, 384, 'player');
        this.player.setScale(0.3);
        this.ak = this.add.image(512, 384, 'ak');
        this.ak.setScale(0.8);
        this.ak.setRotation(0.1);

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
        if (this.cursors.left.isDown)
        {
            this.player.x -= this.playerSpeed * this.game.loop.delta / 1000;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.x += this.playerSpeed * this.game.loop.delta / 1000;
        }

        if (this.cursors.up.isDown)
        {
            this.player.y -= this.playerSpeed * this.game.loop.delta / 1000;
        }
        else if (this.cursors.down.isDown)
        {
            this.player.y += this.playerSpeed * this.game.loop.delta / 1000;
        }

        this.ak.x = this.player.x - 50;
        this.ak.y = this.player.y + 10;

        if (this.spacebar.isDown)
        {
            if (!this.shot.isPlaying)
            {
                this.shot.play({ volume: 0.1 });
            }
            else
            {
                this.shot.resume();
            }
        }
        else if (this.shot.isPlaying)
        {
            this.shot.pause();
        }
    }
}
