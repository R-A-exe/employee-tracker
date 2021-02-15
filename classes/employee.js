class Employee {
    constructor (firstName, lastName, role, employee){
        this.first_name = firstName;
        this.last_name = lastName;
        this.role_id = role.id;
        this.manager_id = employee.id;
    }
}

module.exports = Employee;