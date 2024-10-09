import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EstudianteForm = () => {
    const [estudiante, setEstudiante] = useState({ id: '', nombre: '', apellido: '' });
    const [estudiantes, setEstudiantes] = useState([]);
    const [fetchEstudiantesTrigger, setFetchEstudiantesTrigger] = useState(false);

    const fetchEstudiantes = async () => {
        try {
            const response = await axios.get('/api/estudiantes');
            setEstudiantes(response.data);
        } catch (error) {
            console.error("Error al obtener los estudiantes:", error);
        }
    };

    useEffect(() => {
        fetchEstudiantes();
    }, [fetchEstudiantesTrigger]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEstudiante(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Enviando datos del estudiante:", estudiante);
            if (estudiante.id) {
                await axios.put(`/api/estudiantes/${estudiante.id}`, estudiante);
            } else {
                await axios.post('/api/estudiantes', estudiante);
            }
            setFetchEstudiantesTrigger(prev => !prev);
            setEstudiante({ id: '', nombre: '', apellido: '' });
        } catch (error) {
            console.error("Error guardando el estudiante:", error);
        }
    };

    return (
        <div>
            <h2>Registro de Estudiante</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="id" 
                    value={estudiante.id} 
                    placeholder="ID del Estudiante" 
                    required 
                    onChange={handleChange} 
                />
                <input 
                    type="text" 
                    name="nombre" 
                    value={estudiante.nombre} 
                    placeholder="Nombre del Estudiante" 
                    required 
                    onChange={handleChange} 
                />
                <input 
                    type="text" 
                    name="apellido" 
                    value={estudiante.apellido} 
                    placeholder="Apellido del Estudiante" 
                    required 
                    onChange={handleChange} 
                />
                <button type="submit">Guardar Estudiante</button>
            </form>

            <h2>Lista de Estudiantes</h2>
            <ul>
                {estudiantes.map(est => (
                    <li key={est.id}>{est.nombre} {est.apellido} (ID: {est.id})</li>
                ))}
            </ul>
        </div>
    );
};

export default EstudianteForm;
