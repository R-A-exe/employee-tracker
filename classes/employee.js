class Employee {
    constructor (firstName, lastName, role, employee){
        this.first_name = firstName;
        this.last_name = lastName;
        this.role_id = role.id;
        employee? this.manager_id = employee.id : this.manager_id = null;
    }

    toDb(){
        return [this.first_name, this.last_name, this.role_id, this.manager_id];
    }

}

module.exports = Employee;