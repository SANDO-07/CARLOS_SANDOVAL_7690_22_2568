import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [notas, setNotas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [notaParaEditar, setNotaParaEditar] = useState({
        actividades: 0,
        primerParcial: 0,
        segundoParcial: 0,
        examenFinal: 0,
    });
    const [estudianteParaEditar, setEstudianteParaEditar] = useState({ id: '', nombre: '', apellido: '' });
    const [fetchNotasTrigger, setFetchNotasTrigger] = useState(false);
    const [fetchEstudiantesTrigger, setFetchEstudiantesTrigger] = useState(false);
    const [mostrarNotas, setMostrarNotas] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchNotas = async () => {
        const response = await axios.get('/api/notas');
        setNotas(response.data);
    };
    
    const fetchEstudiantes = async () => {
        const response = await axios.get('/api/estudiantes');
        setEstudiantes(response.data);
    };    

    useEffect(() => {
        fetchNotas();
    }, [fetchNotasTrigger]);

    useEffect(() => {
        fetchEstudiantes();
    }, [fetchEstudiantesTrigger]);

    const handleSubmitEstudiante = async (e) => {
        e.preventDefault();
        try {
            if (estudianteParaEditar?.id) {
                await axios.put(`/api/estudiantes/${estudianteParaEditar.id}`, estudianteParaEditar);
            } else {
                await axios.post('/api/estudiantes', estudianteParaEditar);
            }
            setFetchEstudiantesTrigger(prev => !prev);
            setEstudianteParaEditar({ id: '', nombre: '', apellido: '' });
        } catch (error) {
            console.error("Error creando/actualizando el estudiante:", error);
        }
    };

    const handleSubmitNota = async (e) => {
        e.preventDefault();
        const actividades = parseFloat(notaParaEditar.actividades);
        const primerParcial = parseFloat(notaParaEditar.primerParcial);
        const segundoParcial = parseFloat(notaParaEditar.segundoParcial);
        const examenFinal = parseFloat(notaParaEditar.examenFinal);

        if (isNaN(actividades) || isNaN(primerParcial) || isNaN(segundoParcial) || isNaN(examenFinal)) {
            setErrorMessage("Todos los campos deben ser números.");
            return;
        }

        if (actividades > 35 || primerParcial > 15 || segundoParcial > 15 || examenFinal > 35) {
            setErrorMessage("Los valores ingresados superan los límites permitidos. Actividades: 35, Primer Parcial: 15, Segundo Parcial: 15, Examen Final: 35.");
            return;
        }

        try {
            if (notaParaEditar?.id) {
                await axios.put(`/api/notas/${notaParaEditar.id}`, {
                    ...notaParaEditar,
                    actividades,
                    primerParcial,
                    segundoParcial,
                    examenFinal
                });
            } else {
                await axios.post('/api/notas', {
                    ...notaParaEditar,
                    actividades,
                    primerParcial,
                    segundoParcial,
                    examenFinal
                });
            }
            setFetchNotasTrigger(prev => !prev);
            setNotaParaEditar({ actividades: 0, primerParcial: 0, segundoParcial: 0, examenFinal: 0 });
            setErrorMessage('');
        } catch (error) {
            console.error("Error creando/actualizando la nota:", error);
        }
    };

    const handleEstudianteChange = (e) => {
        const { name, value } = e.target;
        setEstudianteParaEditar(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNotaChange = (e) => {
        const { name, value } = e.target;
        if (name === 'estudianteId') {
            setNotaParaEditar(prev => ({
                ...prev,
                estudiante: { ...prev.estudiante, id: value }
            }));
        } else {
            setNotaParaEditar(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const calcularPromedio = (estudianteId) => {
        const notasEstudiante = notas.filter(nota => nota.estudiante?.id === estudianteId);
        if (!notasEstudiante.length) return null;

        const sumaTotal = notasEstudiante.reduce((acum, nota) => {
            const { actividades, primerParcial, segundoParcial, examenFinal } = nota;
            return acum + 
                (parseFloat(actividades) || 0) + 
                (parseFloat(primerParcial) || 0) + 
                (parseFloat(segundoParcial) || 0) + 
                (parseFloat(examenFinal) || 0);
        }, 0);

        const promedio = sumaTotal / notasEstudiante.length;
        return promedio.toFixed(2);
    };

    const handleDeleteEstudiante = async (id) => {
        try {
            await axios.delete(`/api/estudiantes/${id}`);
            setFetchEstudiantesTrigger(prev => !prev);
            setNotas(prevNotas => prevNotas.filter(nota => nota.estudiante.id !== id));
        } catch (error) {
            console.error("Error eliminando el estudiante:", error);
        }
    };

    return (
        <div className="container">
            <h1>Sistema de ingreso de Notas</h1>

            <div className="form-section">
                <form onSubmit={handleSubmitEstudiante} className="estudiante-form">
                    <h2>Registro de Estudiante</h2>
                    <input 
                        type="text" 
                        name="id" 
                        value={estudianteParaEditar?.id || ''} 
                        placeholder="ID del Estudiante" 
                        required 
                        onChange={handleEstudianteChange} 
                    />
                    <input 
                        type="text" 
                        name="nombre" 
                        value={estudianteParaEditar?.nombre || ''} 
                        placeholder="Nombre del Estudiante" 
                        required 
                        onChange={handleEstudianteChange} 
                    />
                    <input 
                        type="text" 
                        name="apellido" 
                        value={estudianteParaEditar?.apellido || ''} 
                        placeholder="Apellido del Estudiante" 
                        required 
                        onChange={handleEstudianteChange} 
                    />
                    <button type="submit">Guardar Estudiante</button>
                </form>

                <form onSubmit={handleSubmitNota} className="nota-form">
                    <h2>Ingreso de Notas</h2>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <input 
                        type="text" 
                        name="estudianteId" 
                        value={notaParaEditar?.estudiante?.id || ''} 
                        placeholder="ID del Estudiante" 
                        required 
                        onChange={handleNotaChange} 
                    />
                    <input 
                        type="number" 
                        name="actividades" 
                        value={notaParaEditar?.actividades || ''} 
                        placeholder="Actividades" 
                        required 
                        onChange={handleNotaChange} 
                    />
                    <input 
                        type="number" 
                        name="primerParcial" 
                        value={notaParaEditar?.primerParcial || ''} 
                        placeholder="Primer Parcial" 
                        required 
                        onChange={handleNotaChange} 
                    />
                    <input 
                        type="number" 
                        name="segundoParcial" 
                        value={notaParaEditar?.segundoParcial || ''} 
                        placeholder="Segundo Parcial" 
                        required 
                        onChange={handleNotaChange} 
                    />
                    <input 
                        type="number" 
                        name="examenFinal" 
                        value={notaParaEditar?.examenFinal || ''} 
                        placeholder="Examen Final" 
                        required 
                        onChange={handleNotaChange} 
                    />
                    <button type="submit">Guardar Nota</button>
                </form>
            </div>

            <button onClick={() => setMostrarNotas(prev => !prev)}>
                {mostrarNotas ? 'Ocultar Notas' : 'Ver Notas de los Estudiantes'}
            </button>

            {mostrarNotas && (
                <div className="estudiante-list">
                    <h2>Lista de Estudiantes</h2>
                    {estudiantes.map(estudiante => (
                        <div key={estudiante.id} className="estudiante">
                            <p><strong>ID:</strong> {estudiante.id}</p>
                            <p><strong>Nombre:</strong> {estudiante.nombre}</p>
                            <p><strong>Apellido:</strong> {estudiante.apellido}</p>
                            
                            {notas.filter(nota => nota.estudiante?.id === estudiante.id).map(nota => (
                                <div key={nota.id}>
                                    <p><strong>Actividades:</strong> {nota.actividades}</p>
                                    <p><strong>Primer Parcial:</strong> {nota.primerParcial}</p>
                                    <p><strong>Segundo Parcial:</strong> {nota.segundoParcial}</p>
                                    <p><strong>Examen Final:</strong> {nota.examenFinal}</p>
                                </div>
                            ))}
                            
                            <p><strong>Promedio:</strong> {calcularPromedio(estudiante.id)}</p>

                            <button onClick={() => setEstudianteParaEditar(estudiante)}>Editar Estudiante</button>
                            <button onClick={() => handleDeleteEstudiante(estudiante.id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
                                Eliminar Estudiante
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;
