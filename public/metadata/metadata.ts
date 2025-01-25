type ObjectType = 
    'health_potion' | 
    'scrap' | 
    'trap' | 
    'trash' | 
    'key' | 
    'pile' | 
    'steam_turbine' | 
    'decoration';

type EnemyType = 'raider' | 'zombie' | 'mutant';
type PileDrop = 'useless' | 'fuel' | 'wire' | 'steam_pipe' | 'magnet' | 'membrane' | 'amplifier';

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
    // Removed ancestorOrigins to avoid conflict
}

const locations: GameLocation[] = [
    {
        id: 1,
        name: 'Scrapyard',
        type: 'scrapyard',
        objects: [
            { id: 1, type: 'health_potion', x: 100, rare: 'common' },
            { id: 2, type: 'scrap', x: 200, rare: 'common' },
            { id: 3, type: 'trap', x: 150, rare: 'common' },
            { id: 4, type: 'pile', x: 250, rare: 'common', drop: ['useless', 'fuel', 'wire'] },
            { id: 5, type: 'steam_turbine', x: 300, rare: 'rare' }
        ],
        enemies: [
            { id: 1, type: 'raider', x: 300, health: 100 },
            { id: 2, type: 'zombie', x: 500, health: 150 }
        ]
    },
    {
        id: 2,
        name: 'Town',
        type: 'town',
        objects: [
            { id: 6, type: 'health_potion', x: 400, rare: 'common' },
            { id: 7, type: 'decoration', x: 600, rare: 'common' }
        ],
        enemies: [
            { id: 3, type: 'zombie', x: 700, health: 150 },
            { id: 4, type: 'mutant', x: 900, health: 200 }
        ]
    }
];


const getEnemiesInRange = (locationId: number, rangeStart: number, rangeEnd: number): Enemy[] => {
    const location = locations.find(loc => loc.id === locationId);
    if (!location) return [];
    return location.enemies.filter(enemy => enemy.x >= rangeStart && enemy.x <= rangeEnd);
};

// Example: Get enemies between coordinates 200 and 600 in Scrapyard
console.log(getEnemiesInRange(1, 200, 600));

const addObjectToLocation = (locationId: number, object: GameObject): void => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
        location.objects.push(object);
    }
};

// Example of adding a new object
addObjectToLocation(1, { id: 8, type: 'pile', x: 350, rare: 'common', drop: ['magnet', 'membrane', 'amplifier'] });

const removeObjectFromLocation = (locationId: number, objectId: number): void => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
        location.objects = location.objects.filter(obj => obj.id !== objectId);
    }
};

// Example of removing an object
removeObjectFromLocation(1, 1); // Removes the object with id = 1 from Scrapyard