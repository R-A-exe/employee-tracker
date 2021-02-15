class Employee {
    constructor (firstName, lastName, role, employee){
        this.first_name = firstName;
        this.last_name = lastName;
        isNaN(role)? this.role_id = role.id : this.role_id = role;
        !employee? this.manager_id = null : isNaN(employee)? this.manager_id = employee.id : this.manager_id = employee;
    }

    toDb(){
        return [this.first_name, this.last_name, this.role_id, this.manager_id];
    }

}

module.exports = Employee;