-- query de nuestro proyecto:

CREATE DATABASE sistema_notas_registro;

USE sistema_notas_registro;

CREATE TABLE Estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL
);

CREATE TABLE Notas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT,
    actividades DECIMAL(5,2),
    primer_parcial DECIMAL(5,2),
    segundo_parcial DECIMAL(5,2),
    examen_final DECIMAL(5,2),
    FOREIGN KEY (estudiante_id) REFERENCES Estudiantes(id) ON DELETE CASCADE
);

-- Ingresamos nuestros alumnos

INSERT INTO Estudiantes (nombre, apellido) VALUES 
('Juan', 'Pérez'),
('María', 'Gómez'),
('Carlos', 'López'),
('Ana', 'Martínez'),
('Luis', 'Hernández'),
('Sofía', 'Ramírez'),
('Diego', 'Torres');


-- Ingresamos las notas de nuestros alumnos 

INSERT INTO Notas (estudiante_id, actividades, primer_parcial, segundo_parcial, examen_final) VALUES 
(1, 30.00, 12.00, 14.00, 28.00), -- Juan Pérez
(2, 32.50, 10.00, 13.50, 30.00), -- María Gómez
(3, 25.00, 14.00, 12.00, 20.00), -- Carlos López
(4, 35.00, 15.00, 14.50, 33.00), -- Ana Martínez
(5, 28.00, 11.00, 10.50, 27.00), -- Luis Hernández
(6, 30.50, 13.00, 12.50, 29.00), -- Sofía Ramírez
(7, 34.00, 15.00, 14.00, 34.00); -- Diego Torres