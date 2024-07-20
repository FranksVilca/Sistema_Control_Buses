import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MarcarAsistencias = () => {
    const { codigoTurno } = useParams(); 
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchAsistencias = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/Asistencias/${codigoTurno}`);
                const agrupadoPorTurno = agruparPorTurno(response.data);
                setTurnos(agrupadoPorTurno);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchAsistencias();
    }, [codigoTurno]);
    const agruparPorTurno = (asistencias) => {
        return asistencias.reduce((acc, asistencia) => {
            const { Codigo_Turno } = asistencia;
            if (!acc[Codigo_Turno]) {
                acc[Codigo_Turno] = [];
            }
            acc[Codigo_Turno].push(asistencia);
            return acc;
        }, {});
    };

    const handleAsistenciaChange = async (codigoAsistencia, codigoUsuario, newValue) => {
        try {
            await axios.put(`http://localhost:3001/api/Asistencias/${codigoAsistencia}`, { Codigo_Usuario: codigoUsuario, Asistencia: newValue });
            setTurnos((prevTurnos) =>
                Object.fromEntries(
                    Object.entries(prevTurnos).map(([turno, asistencias]) => [
                        turno,
                        asistencias.map((asistencia) =>
                            asistencia.Codigo_Asistencia === codigoAsistencia && asistencia.Codigo_Usuario === codigoUsuario
                                ? { ...asistencia, Asistencia: newValue }
                                : asistencia
                        )
                    ])
                )
            );
        } catch (err) {
            setError(err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

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
                                <tr key={asistencia.Codigo_Usuario}>
                                    <td>{asistencia.Codigo_Usuario}</td>
                                    <td>{asistencia.Nombre_Usuario}</td>
                                    <td>
                                        <select
                                            value={asistencia.Asistencia ? 1 : 0}
                                            onChange={(e) =>
                                                handleAsistenciaChange(asistencia.Codigo_Asistencia, asistencia.Codigo_Usuario, e.target.value === '1')
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

export default MarcarAsistencias;
