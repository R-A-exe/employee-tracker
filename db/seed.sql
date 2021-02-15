-- 1
INSERT INTO department VALUES(default, 'Human Resources');
-- 2
INSERT INTO department VALUES(default, 'IT');
-- 3
INSERT INTO department VALUES(default, 'Operations');

    --1
INSERT INTO role VALUES(default, 'HR Advisor', 70000, 1);
    --2
INSERT INTO role VALUES(default, 'HR Manager', 80000, 1);
    --3
INSERT INTO role VALUES(default, 'HR Director', 100000, 1);

        --1
INSERT INTO employee VALUES(default, 'Dir', 'Ector', 3, null);
        --2
INSERT INTO employee VALUES(default, 'Mana', 'Gerr', 2 , 1);
        --3
INSERT INTO employee VALUES(default, 'Ad', 'Visor', 1 , 2);
        --4
INSERT INTO employee VALUES(default, 'Ana', 'Theradvisor', 1 , 2);

    --4
INSERT INTO role VALUES(default, 'Tech Engineer', 80000, 2);
    --5
INSERT INTO role VALUES(default, 'Tech Manager', 90000, 2);
    --6
INSERT INTO role VALUES(default, 'Tech Director', 110000, 2);

        --5
INSERT INTO employee VALUES(default, 'Dirof', 'Techdep', 6, null);
        --6
INSERT INTO employee VALUES(default, 'Mana', 'Gerr', 5 , 5);
        --7
INSERT INTO employee VALUES(default, 'Engi', 'Neer', 4 , 6);
        --8
INSERT INTO employee VALUES(default, 'Seco', 'Ndengineer', 4 , 6);

    --7
INSERT INTO role VALUES(default, 'Business Development Rep', 60000, 3);
    --8
INSERT INTO role VALUES(default, 'Sales Team Lead', 80000, 3);
    --9
INSERT INTO role VALUES(default, 'Sales Director', 100000, 3);

        --9
INSERT INTO employee VALUES(default, 'Sal', 'Esdir', 9, null);
        --10
INSERT INTO employee VALUES(default, 'Tea', 'Mlead', 8 , 9);
        --11
INSERT INTO employee VALUES(default, 'Busdev', 'Rep', 7, 10);
        --12
INSERT INTO employee VALUES(default, 'Theo', 'Therrep', 7 , 10);

