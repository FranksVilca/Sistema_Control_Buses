import React from 'react';
import './TrabajadorPerfil.css';

const WorkerProfile = () => {
    // Datos del trabajador (simulación)
    const trabajador = {
        nombre: 'Juan Pérez',
        edad: 45,
        ubicacion: 'Arequipa, Perú',
        idTrabajador: 'TR-012345',
        empresa: 'Ferreiros',
        cargo: 'Construcción civil',
        dni: '12345678',
        vivienda: 'Calle Principal 123',
        estadoCivil: 'Casado',
        tipoSangre: 'O+',
        categoriaLaboral: 'Contratista',
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-about">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5jQBCUrSznF87uovPNohqPnO6Kr-maYEge54VLk0_BKg2UlxW1_lG4FfZkZ7eLKn13Ko&usqp=CAU" alt="Trabajador" width='300px' height='400px'/>
                    <p><strong>Empresa:</strong> {trabajador.empresa}</p>
                    <p><strong>Cargo:</strong> {trabajador.cargo}</p>
                    <p><strong>ID Trabajador:</strong> {trabajador.idTrabajador}</p>
                    <p><strong>Categoría Laboral:</strong> {trabajador.categoriaLaboral}</p>
                </div>
                <div className="profile-details">
                    <h2>Datos Personales</h2>
                    <p><strong>Nombre:</strong> {trabajador.nombre}</p>
                    <p><strong>Edad:</strong> {trabajador.edad} años</p>
                    <p><strong>Ubicación:</strong> {trabajador.ubicacion}</p>
                    <p><strong>DNI:</strong> {trabajador.dni}</p>
                    <p><strong>Vivienda:</strong> {trabajador.vivienda}</p>
                    <p><strong>Estado Civil:</strong> {trabajador.estadoCivil}</p>
                    <p><strong>Tipo de Sandre:</strong> {trabajador.tipoSangre}</p>
                </div>
            </div>
        </div>
    );
}

export default WorkerProfile;
