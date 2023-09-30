

class GameRecord {
    constructor(username, score) 
    {
        this.username = username
        this.score = score
    }
}


export class GameStorage
{
    constructor()
    {
        this.storage = localStorage;
    }
}
