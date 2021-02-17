# Employee CMS    [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

A Human Resources CMS CLI that helps managing departments, roles and employees.

### Functions

- View, add and delete departments to the database;
- View department budget based on salaried employees in the department;
- View, add and delete roles with a title, salary and department;
- View and add employees with name, role and manager;
- Update employee last name, role and manager;l
- View employees by manager, by role or by department.




## Table of content

### [Installation](##-Installation)

### [Usage](##-Usage)

### [License](##-License)




## Installation

After cloning the repo:

1- Create the database from the tables.sql file;

2- In the database.js, add the host, port, user, password and database info to the connection variable;

3- Run 
```
node app.js 
```
to launch.



## Usage

After launching, follow the prompts:

-   Main Menu
    -   Departments: on load, departments table is displayed
        -   Add department
            -   Type department name
        -   Delete department
            -   Choose department
            -   Confirm
        -   View department budget
            -   Choose department name
        -   Back, to return to main menu
    -   Roles: on load, roles table is displayed
        -   Add role
            -   Type title
            -   Type salary
            -   Choose department ID (table is displayed)
        -   Delete role
            -   Choose role ID (table is displayed)
            -   Confirm
        -   Back, to return to main menu
    -   Employees: on load, employees table is displayed
        -   Add employee
            -   Type first name
            -   Type last name
            -   Choose role ID (table is displayed)
            -   Choose manager ID (table of employees of the same department is displayed)
        -   Delete employee
            -   Choose employee ID (table is displayed)
            -   Confirm
        -   Update employee
            -   Choose employee ID (table is displayed)
            -   Choose field to update
                -   Last name
                    -   Type new last name
                -   Role
                    -   Choose new role ID (table is displayed)
                -   Manager 
                    -   Choose new manager ID (table of employees of the same department is displayed)
                -   Back, to return to Employees menu
        -   View by
            -   Choose view
                -   Department
                    -   Choose department ID (table is displayed)
                -   Role
                    -   Choose department ID (table is displayed)
                    -   Choose role ID from available roles in the department
                -   Manager
                    -   Choose department ID (table is displayed)
                    -   Choose manager ID from available managers in the department
                -   Back, to return to Employees menu
        -   Back, to return to main menu





## License

This project is covered under the following license: The MIT License. For more information, please visit [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)







