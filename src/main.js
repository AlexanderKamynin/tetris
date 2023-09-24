import { Field, Render } from "./render.js";

const colors = {
    'I': '#00ffff',
    'O': '#faff00',
    'T': '#9800ff',
    'S': '#59f792',
    'Z': '#fe3232',
    'J': '#3266fe',
    'L': '#fd8c00'
};

const tetrominos = {
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


let playground_map = new Field();
let playground_renderer = new Render("playground", playground_map);
playground_renderer.render();

let figure_preview_map = new Field(4, 4);
let figure_preview_renderer = new Render("figure_preview", figure_preview_map);
figure_preview_renderer.render();


let count = 0;
let tetromino = 0; 
let rAF = null;
let game_over = false;

class Engine {
    constructor() {
        this.status = 'Play';
        this.score = 0;
        this.tetromino_sequence = [];
    }

    get_seed(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generate_sequence() {
        const sequence =  ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

        while (sequence.length) {
            const rand = this.get_seed(0, sequence.length - 1);
            const name = sequence.splice(rand, 1)[0];
            this.tetromino_sequence.push(name);
        }
    }

    get_next_tetromino() {
        // если следующей нет — генерируем
        if (this.tetromino_sequence.length === 0) {
            this.generate_sequence();
        }

        const name = this.tetromino_sequence.pop();

        const matrix = tetrominos[name];
    
        // I и O стартуют с середины, остальные — чуть левее
        const column = playground_map.width / 2 - Math.ceil(matrix[0].length / 2);
    
        // I начинает с 21 строки (смещение -1), а все остальные — со строки 22 (смещение -2)
        const row = name === 'I' ? -1 : -2;
    
        // вот что возвращает функция 
        return {
        name: name,      // название фигуры (L, O, и т.д.)
        matrix: matrix,  // матрица с фигурой
        row: row,        // текущая строка (фигуры стартуют за видимой областью холста)
        column: column         // текущий столбец
        };
    }

    rotate(matrix) { 
        const N = matrix.length - 1;
        const result = matrix.map((row, i) => row.map((val, j) => matrix[N-j][i]));
        return matrix;
    }

    check_move(matrix, cellRow, cellColumn) {
        for (let row = 0; row < matrix.length; row++) {
            for (let column = 0; column < matrix[row].length; column++){
                if (matrix[row][column] && 
                    (
                        cellColumn + column < 0 ||
                        cellColumn + column >= playground_map.width ||
                        cellRow + row >= playground_map.height ||
                        playground_map[cellRow + row][cellColumn + column].fill
                    ) )
                {
                    return false;
                }
            }
        }
        return true;
    }

    place_tetromino(tetromino) 
    {
        for (let row = 0; row < tetromino.matrix.length; row++)
        {
            for (let column = 0; column < tetromino.matrix[row].length; column++)
            {
                if (tetromino.matrix[row][column]){
                    if (tetromino.row + row < 0){
                        // gameOver
                        return show_game_over();
                    }
                    // не вышли за границы поля - записываем в массив поля новую фигуру
                    // TODO: тут типо записываем
                }
            }
        }

        //проверяем, что ряды очистились
        for (let row = playground_map.length - 1; row >= 0; )
        {
            if (playground_map[row].every(point => !!point.fill))
            {
                for (let r = row; r >= 0; r--)
                {
                    for (let c = 0; c < playground_map.width; c++)
                    {
                        playground_map[r][c] = playground_map[r-1][c];
                    }
                }
            }
            else
            {
                row--;
            }
        }
    }

    show_game_over() {
        cancelAnimationFrame(rAF);
        game_over = true;
          // рисуем чёрный прямоугольник посередине поля
        context.fillStyle = 'black';
        context.globalAlpha = 0.75;
        context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
        // пишем надпись белым моноширинным шрифтом по центру
        context.globalAlpha = 1;
        context.fillStyle = 'white';
        context.font = '36px monospace';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
    }

    keyboard_handle(tetromino) {
        document.addEventListener('keydown', function(event) {
            if (game_over)
            {
                return;
            }
            
            const key_name = event.key;
            if (key_name === 'ArrowLeft' || key_name == 'ArrowRight')
            {
                const new_column = key_name == 'ArrowLeft' ? tetromino.column - 1 : tetromino.column + 1;

                if (this.check_move(tetromino.matrix, tetromino.row, new_column)){
                    tetromino.column = new_column;
                }
            }

            if (key_name === 'ArrowUp')
            {
                const new_matrix = this.rotate(tetromino.matrix);
                if (this.check_move(matrix, tetromino.row, tetromino.column))
                {
                    tetromino.matrix = new_matrix;
                }
            }

            if (key_name === 'ArrowDown')
            {
                const new_row = tetromino.row + 1;
                if (!this.check_move(tetromino.matrix, new_row, tetromino.column)){
                    tetromino.row = new_row - 1;
                    this.place_tetromino();
                    return;
                }
                tetromino.row = new_row;
            }
        })
    }
}

let engine = new Engine();
// engine.keyboard_handle();