import { Field, Render } from "./render.js";
import {FPS, colors, tetrominos} from "./const.js"; 
import {GameStorage} from "./storage.js"


class Engine {
    constructor() {
        this.game_storage = new GameStorage();

        this.score = 0;
        this.score_elem = document.getElementById("score")
        this.level = 1;
        this.level_elem = document.getElementById("level")

        this.frame_number = 0;
        this.game_over = false;

        this.playground_map = new Field();
        this.playground_renderer = new Render("playground", this.playground_map);
        this.playground_renderer.render_playground();

        this.figure_preview_map = new Field(4, 4);
        this.figure_preview_renderer = new Render("figure_preview", this.figure_preview_map);
        this.figure_preview_renderer.render_playground();

        this.tetromino_sequence = [];
        this.current_tetromino = this.get_next_tetromino(); 

        this.keyboard_handle();
    }

    get_seed(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generate_sequence() {
        const sequence =  Object.keys(tetrominos);

        while (sequence.length) {
            const rand = this.get_seed(0, sequence.length - 1);
            const name = sequence.splice(rand, 1)[0];
            this.tetromino_sequence.push(name);
        }
    }

    get_next_tetromino() {
        // нет последовательности тетромино или тетромино осталось последнее? генерируем
        if (this.tetromino_sequence.length === 0) {
            this.generate_sequence();
        }

        // текущее тетромино
        const name = this.tetromino_sequence.pop();

        if (this.tetromino_sequence.length === 0){
            this.generate_sequence();
        }

        // будущее тетромино
        const preview_name = this.tetromino_sequence.at(-1);
        const preview_matrix = tetrominos[preview_name];
        this.preview_tetromino(preview_name, preview_matrix);

        const tetromino_matrix = tetrominos[name];
        // Определяется стартовое положение элементов
        const column = this.playground_map.width / 2 - Math.ceil(tetromino_matrix[0].length / 2);
    
        // I начинает с 21 строки (смещение -1), а все остальные — со строки 22 (смещение -2)
        const row = name === 'I' ? -1 : -2;

        return {
            name: name,      // название фигуры
            matrix: tetromino_matrix,  // матрица с фигурой
            row: row,        // текущая строка
            column: column   // текущий столбец
        };
    }

    preview_tetromino(name, matrix) {
        // чистим предыдущее тетромино на preview элементе
        this.figure_preview_renderer.render_playground();

        const color = colors[name];
        this.figure_preview_renderer.render_tetromino(color, {
            name: name,
            matrix: matrix,
            row: 0,
            column: 0
        })
    }

    rotate(matrix) { 
        const N = matrix.length - 1;
        const result = matrix.map((row, i) => row.map((val, j) => matrix[N-j][i]));
        return result;
    }

    check_move(matrix, new_row, new_column) {
        for (let row = 0; row < matrix.length; row++) {
            for (let column = 0; column < matrix[row].length; column++){
                if (matrix[row][column] && 
                    (
                        new_column + column < 0 ||
                        new_column + column >= this.playground_map.width ||
                        new_row + row >= this.playground_map.height ||
                        this.playground_map.map[new_row + row][new_column + column].fill
                    ) )
                {
                    return false;
                }
            }
        }
        return true;
    }

    place_tetromino() 
    {
        for (let row = 0; row < this.current_tetromino.matrix.length; row++)
        {
            for (let column = 0; column < this.current_tetromino.matrix[row].length; column++)
            {
                if (this.current_tetromino.matrix[row][column]){
                    // край фигуры вылезает за верхний край
                    if (this.current_tetromino.row + row < 0){
                        // game_over
                        this.show_game_over();
                        return;
                    }

                    // не вышли за границы поля - записываем в массив поля новую фигуру
                    this.playground_map.map[this.current_tetromino.row + row][this.current_tetromino.column + column].color = colors[this.current_tetromino.name];
                    this.playground_map.map[this.current_tetromino.row + row][this.current_tetromino.column + column].fill = 1;
                }
            }
        }

        this.score += 100;

        //проверяем, что ряды очистились
        for (let row = this.playground_map.height - 1; row >= 0; )
        {
            if (this.playground_map.map[row].every(cell => cell.fill == 1))
            {
                this.level += 1;
                this.score += 1000;

                for (let r = row; r >= 0; r--)
                {
                    for (let c = 0; c < this.playground_map.width; c++)
                    {
                        this.playground_map.map[r][c].fill = this.playground_map.map[r-1][c].fill;
                        this.playground_map.map[r][c].color = this.playground_map.map[r-1][c].color;
                    }
                }
            }
            else
            {
                row--;
            }
        }

        this.score_elem.textContent = new Intl.NumberFormat("ru-RU").format(this.score)
        this.level_elem.textContent = this.level

        this.current_tetromino = this.get_next_tetromino();
    }

    show_game_over() {
        this.game_over = true;
        console.log("game over");
        this.game_storage.set_item(this.score);
        window.location.href = './records.html';
        //this.playground_renderer.render_game_over();
    }

    keyboard_handle() {
        document.addEventListener('keydown', (event) => {
            console.log("push the key");
            if (this.game_over)
            {
                return;
            }
            
            const key_name = event.key;
            if (key_name === 'ArrowLeft' || key_name == 'ArrowRight')
            {
                const new_column = key_name == 'ArrowLeft' ?  (this.current_tetromino.column) - 1 :  this.current_tetromino.column + 1;

                if (this.check_move( this.current_tetromino.matrix,  this.current_tetromino.row, new_column)){
                    this.current_tetromino.column = new_column;
                }
            }

            if (key_name === 'ArrowUp')
            {
                const new_matrix = this.rotate(this.current_tetromino.matrix);
                if (this.check_move(new_matrix, this.current_tetromino.row, this.current_tetromino.column))
                {
                    this.current_tetromino.matrix = new_matrix;
                }
            }

            if (key_name === 'ArrowDown')
            {
                const new_row = this.current_tetromino.row + 1;
                if (!this.check_move( this.current_tetromino.matrix, new_row, this.current_tetromino.column)){
                    this.current_tetromino.row = new_row - 1;
                    this.place_tetromino();
                    return;
                }
                this.current_tetromino.row = new_row;
            }
        })
    }

    start() 
    {
        if (!this.game_over)
        {
            requestAnimationFrame(this.start.bind(this));
            
            this.playground_renderer.render_playground();

            if (this.current_tetromino)
            {

                let speed = FPS - 5 * this.level;
                // for high level
                if (speed < 10){
                    speed = 10
                }

                if (++(this.frame_number) > speed)
                {
                    this.current_tetromino.row++;
                    this.frame_number = 0;

                    if (!this.check_move(this.current_tetromino.matrix, this.current_tetromino.row, this.current_tetromino.column))
                    {
                        this.current_tetromino.row--;
                        this.place_tetromino();
                    }
                }

            const color = colors[this.current_tetromino.name];
            this.playground_renderer.render_tetromino(color, this.current_tetromino);
            }
        }
        
        return;
    }
}


let engine = new Engine();
engine.start();