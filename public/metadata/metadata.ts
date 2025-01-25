interface GameObject {
    id: number;
    type: string; 
    x: number;
    rare: string;    
}

interface Enemy {
    id: number;
    type: string; 
    x: number;    
    health: number; 
}

interface Location {
    id: number;
    name: string;
    type: string; 
    objects: GameObject[]; 
    enemies: Enemy[];      
}

const locations: Location[] = [
    {
        id: 1,
        name: 'Scrapyard',
        type: 'urban',
        objects: [
            { id: 1, type: 'health_potion', x: 100, rare: 'common'},
            { id: 2, type: 'scrap', x: 200, rare: 'common'},
            { id: 3, type: 'trap', x: 150, rare: 'common'},
            { id: 5, type: 'trash', x: 300, rare: 'common'}
        ],
        
        enemies: [
            { id: 1, type: 'raider', x: 300, health: 100 },
            { id: 2, type: 'zombie', x: 500, health: 150 }
        ]
    },
    {
        id: 2,
        name: 'Desert of tears',
        type: 'desert',
        objects: [
            { id: 3, type: 'trap', x: 400, rare: 'common'},
            { id: 4, type: 'decoration', x: 600, rare: 'common'}
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

// Пример: получить врагов между координатами 200 и 600 в Scrapyard
console.log(getEnemiesInRange(1, 200, 600));

const addObjectToLocation = (locationId: number, object: GameObject): void => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
        location.objects.push(object);
    }
};

// Пример добавления объекта
addObjectToLocation(1, { id: 5, type: 'key', x: 350, rare: 'common'});

const removeObjectFromLocation = (locationId: number, objectId: number): void => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
        location.objects = location.objects.filter(obj => obj.id !== objectId);
    }
};

// Пример удаления объекта
removeObjectFromLocation(1, 1); // Удалит объект с id = 1 из Scrapyard


export default locations;