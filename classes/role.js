class Role {
    constructor(title, salary, department){
        this.title = title,
        this.salray = salary,
        this.department_id = department.id;
    }

    toDb(){
        return [this.title, this.salray, this.department_id]
    }
}


module.exports = Role;