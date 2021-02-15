class Role {
    constructor(title, salary, department){
        this.title = title,
        this.salray = salary,
        isNaN(department)? this.department_id = department.id : this.department_id = department;
    }

    toDb(){
        return [this.title, this.salray, this.department_id]
    }
}


module.exports = Role;