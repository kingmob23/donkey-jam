type ObjectType =
    'beer' |
    'trap' |
    'pile' |
    'steam_turbine' |
    'train_platform' |
    'decoration';

type EnemyType = 'raider'
type PileDrop = 'trash' | 'fuel' | 'wire' | 'steam_pipe' | 'magnet' | 'membrane' | 'amplifier';

interface GameObject {
    id: number;
    type: ObjectType;
    x: number;
    rare: string;
    drop?: PileDrop[];
}

interface Enemy {
    id: number;
    type: EnemyType;
    x: number;
    health: number;
}

interface GameLocation {
    id: number;
    name: string;
    type: 'scrapyard' | 'town';
    objects: GameObject[];
    enemies: Enemy[];
}

const locations: GameLocation[] = [
    {
        id: 1,
        name: 'Scrapyard',
        type: 'scrapyard',
        objects: [
            { id: 1, type: 'beer', x: 100, rare: 'common' },
            { id: 2, type: 'trap', x: 150, rare: 'common' },
            { id: 3, type: 'pile', x: 250, rare: 'common', drop: ['trash', 'fuel', 'wire'] },
            { id: 4, type: 'steam_turbine', x: 300, rare: 'rare' }
        ],
        enemies: [
            { id: 1, type: 'raider', x: 300, health: 100 },
        ]
    },
    {
        id: 2,
        name: 'Town',
        type: 'town',
        objects: [
            { id: 6, type: 'beer', x: 400, rare: 'common' },
            { id: 7, type: 'decoration', x: 600, rare: 'common' }
        ],
        enemies: []
    }
];

const getEnemiesInRange = (locationId: number, rangeStart: number, rangeEnd: number): Enemy[] => {
    const location = locations.find(loc => loc.id === locationId);
    if (!location) return [];
    return location.enemies.filter(enemy => enemy.x >= rangeStart && enemy.x <= rangeEnd);
};

console.log(getEnemiesInRange(1, 200, 600));

const addObjectToLocation = (locationId: number, object: GameObject): void => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
        location.objects.push(object);
    }
};

addObjectToLocation(1, { id: 8, type: 'pile', x: 350, rare: 'common', drop: ['magnet', 'membrane', 'amplifier'] });

const removeObjectFromLocation = (locationId: number, objectId: number): void => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
        location.objects = location.objects.filter(obj => obj.id !== objectId);
    }
};

removeObjectFromLocation(1, 1);
