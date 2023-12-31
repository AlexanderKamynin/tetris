
export const WIDTH = 10;
export const HEIGHT = 20;
export const CELL_SIZE = 20; // размер клетки в px

export const FPS = 600000;
export const RECORDS_HTML = './record.html';
export const RECORDS_SIZE = 7;

export const colors = {
    'I': '#00ffff',
    'O': '#faff00',
    'T': '#9800ff',
    'S': '#59f792',
    'Z': '#fe3232',
    'J': '#3266fe',
    'L': '#fd8c00'
};

export const tetrominos = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],
    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],
    'O': [
        [1,1],
        [1,1],
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
    ]
};
