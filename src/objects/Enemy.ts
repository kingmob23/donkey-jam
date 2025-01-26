// src/objects/Enemy.ts
import Phaser from 'phaser';

export class Enemy extends Phaser.GameObjects.Image {
    private player: Phaser.GameObjects.Image;
    private speed: number;
    private attackRange: number;
    private attackCooldown: number;
    private lastAttackTime: number;
    private health: number = 50; // Здоровье врага

    // Свойство для визуального эффекта выстрела
    private bang: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number, player: Phaser.GameObjects.Image) {
        super(scene, x, y, 'enemy'); // Предполагается, что у вас есть изображение 'enemy'
        this.player = player;
        this.speed = 50; // Скорость перемещения врага
        this.attackRange = 100; // Дистанция, на которой враг может атаковать
        this.attackCooldown = 2000; // Время между атаками в миллисекундах
        this.lastAttackTime = 0;

        this.setScale(0.5); // Масштабируем врага
        this.setDepth(2); // Устанавливаем глубину для отображения
        scene.add.existing(this);

        // Создаем изображение для эффекта выстрела
        this.bang = scene.add.image(this.x, this.y, 'bang');
        this.bang.setScale(0.5);
        this.bang.setAlpha(0);
        this.bang.setDepth(3);
    }

    update(time: number, delta: number) {
        // Перемещение врага к игроку
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);

        if (distance > 5) { // Избегаем деления на ноль
            const angle = Math.atan2(dy, dx);
            const vx = Math.cos(angle) * this.speed * (delta / 1000);
            const vy = Math.sin(angle) * this.speed * (delta / 1000);
            this.x += vx;
            this.y += vy;
        }

        // Проверка, находится ли враг в пределах дальности атаки
        if (distance <= this.attackRange) {
            if (time >= this.lastAttackTime + this.attackCooldown) {
                this.attack();
                this.lastAttackTime = time;
            }
        }

        // Обновление позиции bang
        this.bang.x = this.x;
        this.bang.y = this.y;
    }

    private attack() {
        // Атака игрока
        this.player.emit('enemyAttack');

        // Показываем эффект выстрела
        this.bang.setAlpha(1);
        this.scene.time.delayedCall(100, () => {
            this.bang.setAlpha(0);
        }, [], this);
    }

    public handlePlayerAttack() {
        // Обработка атаки игрока
        this.health -= 10; // Уменьшаем здоровье врага
        if (this.health <= 0) {
            this.destroy(); // Уничтожаем врага
            // Можно добавить логику для обработки смерти врага, например, анимацию или награду
        }
    }
}