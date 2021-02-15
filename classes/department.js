class Department {
    constructor (name){
        this.name = name;
    }

    toDb(){
        return [this.name];
    }
}

module.exports=Department;