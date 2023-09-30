export class GameStorage
{
    constructor()
    {
        this.storage = localStorage;
    }

    set_item(score)
    {
        if (!this.storage.getItem("records_table"))
        {
            localStorage.setItem("records_table", JSON.stringify([]));
        }

        let records_table = JSON.parse(this.storage.getItem("records_table"));
        records_table.push([this.storage.getItem("username"), score])
        records_table.sort((a,b) =>
            {
                if (a[1] > b[1])
                {
                    return -1;
                }
                if (a[1] < b[1])
                {
                    return 1;
                }

                return 0;
            }    
        );
        
        this.storage.setItem("records_table", JSON.stringify(records_table));
    }

    get_current_user()
    {
        return JSON.parse(this.storage.getItem("username"));
    }

    get_records_table()
    {
        return JSON.parse(this.storage.getItem("records_table"));
    }
}
