import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    player: Phaser.GameObjects.Image;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerSpeed: number = 300;

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

        this.cursors = this.input.keyboard.createCursorKeys();

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
    }
}
