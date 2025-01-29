import { GameObjects, Scene } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    title: GameObjects.Text;
    artist: GameObjects.Text;
    caption: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'bg');

        this.title = this.add.text(512, 300, 'Some Game for Donkey Jam', {
            fontFamily: 'Arial Black', fontSize: 34, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.artist = this.add.text(512, 460, 'Art by Shyphu <3', {
            fontFamily: 'Arial Black', fontSize: 100, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.caption = this.add.text(512, 560, '(coming soon)', {
            fontFamily: 'Arial Black', fontSize: 34, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
