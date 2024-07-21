import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Importa useParams para acceder a parámetros de URL

const Asistencia = () => {
    const [turnos, setTurnos] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { codigoTurno } = useParams(); // Obtiene codigoTurno de la URL

    useEffect(() => {
        const fetchAsistencias = async () => {
            console.log('Fetching asistencias for codigoTurno:', codigoTurno); // Log del código del turno
            try {
                const response = await axios.get(`http://localhost:3001/api/Asistencias/${codigoTurno}`);
                console.log('Response data:', response.data); // Log de los datos obtenidos
                const agrupadoPorTurno = agruparPorTurno(response.data);
                console.log('Grouped by turno:', agrupadoPorTurno); // Log de los datos agrupados
                setTurnos(agrupadoPorTurno);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching asistencias:', err); // Log del error
                setError(err);
                setLoading(false);
            }
        };

        if (codigoTurno) {
            fetchAsistencias();
        }
    }, [codigoTurno]); // Dependencia en codigoTurno para volver a ejecutar cuando cambie

    const agruparPorTurno = (asistencias) => {
        console.log('Grouping asistencias:', asistencias); // Log de las asistencias antes de agrupar
        return asistencias.reduce((acc, asistencia) => {
            const { Codigo_Turno } = asistencia;
            if (!acc[Codigo_Turno]) {
                acc[Codigo_Turno] = [];
            }
            acc[Codigo_Turno].push(asistencia);
            return acc;
        }, {});
    };

    const handleAsistenciaChange = async (codigoAsistencia, newValue) => {
        console.log('Updating asistencia:', { codigoAsistencia, newValue });
        try {
            const intValue = newValue ? 1 : 0; // Convertir el booleano a un valor numérico
            await axios.put(`http://localhost:3001/api/Asistencia/${codigoAsistencia}`, { Asistencia: intValue });
            console.log('Asistencia updated successfully');
            setTurnos((prevTurnos) =>
                Object.fromEntries(
                    Object.entries(prevTurnos).map(([turno, asistencias]) => [
                        turno,
                        asistencias.map((asistencia) =>
                            asistencia.Codigo_Asistencia === codigoAsistencia
                                ? { ...asistencia, Asistencia: intValue }
                                : asistencia
                        )
                    ])
                )
            );
        } catch (err) {
            console.error('Error updating asistencia:', err);
            setError(err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;

    return (
        <div>
            <h1>Asistencias</h1>
            {Object.entries(turnos).map(([turno, asistencias]) => (
                <div key={turno}>
                    <h2>Turno: {turno}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID Usuario</th>
                                <th>Nombre Usuario</th>
                                <th>Asistencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {asistencias.map((asistencia) => (
                                <tr key={asistencia.Codigo_Asistencia}>
                                    <td>{asistencia.Codigo_Usuario}</td>
                                    <td>{asistencia.Nombre}</td>
                                    <td>
                                        <select
                                            value={asistencia.Asistencia ? 1 : 0}
                                            onChange={(e) =>
                                                handleAsistenciaChange(asistencia.Codigo_Asistencia, e.target.value === '1')
                                            }
                                        >
                                            <option value="1">Asistió</option>
                                            <option value="0">Faltó</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default Asistencia;
