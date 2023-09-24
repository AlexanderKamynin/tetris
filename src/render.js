import { WIDTH, HEIGHT, CELL_SIZE } from "./const.js";


class Point {
    constructor(x, y, fill=0, color="#5476f3"){
        this.x = x;
        this.y = y;
        this.color = color;
        this.fill = fill;
    }
}

export class Render {
    /*
    Отвечает за отображение клеток пользователю
    */
    constructor(canvas_id, rendered_obj, cell_size = CELL_SIZE){
        this.canvas_elem = document.getElementById(canvas_id);
        this.rendered_obj = rendered_obj;
        this.cell_size = cell_size;
        
        // set canvas size
        this.canvas_elem.width = this.canvas_width = this.rendered_obj.width * this.cell_size;
        this.canvas_elem.height = this.canvas_height =  this.rendered_obj.height * this.cell_size;
        this.canvas_elem.style.width = `${this.canvas_elem.width}px`;
        this.canvas_elem.style.height = `${this.canvas_elem.height}px`;
    }

    render_playground() {
        if (this.canvas_elem.getContext)
        {
            let context = this.canvas_elem.getContext('2d');
            //чистим то, что было нарисовано
            context.clearRect(0, 0, this.canvas_width, this.canvas_height);

            //рисуем поле
            for (const row of this.rendered_obj.map){
                for (const point of row){
                    context.beginPath();
                    
                    let x = point.x * this.cell_size;
                    let y = point.y * this.cell_size;

                    context.strokeStyle = "#000000";
                    context.lineWidth = 1
                    context.strokeRect(x, y, this.cell_size, this.cell_size);

                    context.fillStyle = point.color;
                    context.fillRect(x, y, this.cell_size, this.cell_size);

                    context.closePath();
                }
            }
        }
    }
    
    render_tetromino(color, tetromino)
    {
        if (this.canvas_elem.getContext)
        {
            let context = this.canvas_elem.getContext('2d');
            context.fillStyle = color;

            for (let row = 0; row < tetromino.matrix.length; row++)
            {
                for (let column = 0; column < tetromino.matrix[row].length; column++)
                {
                    if (tetromino.matrix[row][column])
                    {
                        context.beginPath();
                        
                        let x = (tetromino.column + column) * this.cell_size;
                        let y = (tetromino.row + row) * this.cell_size;
                        if (y >= 0){
                        context.fillRect(x, y, this.cell_size, this.cell_size);

                        context.closePath();
                        }
                    }
                }
            }
        }
    }

    render_game_over()
    {
        if (this.canvas_elem.getContext)
        {
            let context = this.canvas_elem.getContext('2d');

            context.beginPath();
            // рисуем чёрный прямоугольник посередине поля
            context.fillStyle = 'black';
            context.globalAlpha = 0.75;
            context.fillRect(0, this.canvas_height / 2 - 30, this.canvas_width, 60);
            // пишем надпись белым моноширинным шрифтом по центру
            context.globalAlpha = 1;
            context.fillStyle = 'white';
            context.font = '36px monospace';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('GAME OVER!', this.canvas_width / 2, this.canvas_height / 2);

            context.closePath();
        }
    }
}


export class Field {
    /*
    Описывает состояние клеток на поле
    */
    constructor(width = WIDTH, height = HEIGHT) {
        this.width = width;
        this.height = height;
        this.map = []
        this.#create_map();
    }

    #create_map(){
        let map = []
        for (var row = -2; row < this.height; row++){
            map[row] = []
            for (var column = 0; column < this.width; column++){
                map[row][column] = new Point(column,row);
            }
        }
        this.map = map;
    }
}
