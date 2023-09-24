
const WIDTH = 10;
const HEIGHT = 20;
const CELL_SIZE = 20; // размер клетки в px


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

    render() {
        if (this.canvas_elem.getContext){
            let context = this.canvas_elem.getContext('2d');
            //чистим то, что было нарисовано
            context.clearRect(0, 0, this.canvas_width, this.canvas_height);

            //рисуем
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
}


export class Field {
    /*
    Описывает состояние клеток на поле
    */
    constructor(width = WIDTH, height = HEIGHT) {
        this.width = width;
        this.height = height;
        this.map = this.#create_map();
    }

    #create_map(){
        let map = []
        for (var i = 0; i < this.height; i++){
            map[i] = []
            for (var j = 0; j < this.width; j++){
                map[i][j] = new Point(j,i);
            }
        }
        return map;
    }
}
