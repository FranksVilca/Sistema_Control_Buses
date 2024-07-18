import React from 'react';
import './TrabajadorTurno.css';

const WorkerView = () => {
    return (
        <div className="worker-view">
            <header className="header">
                <h1>Turno 1A</h1>
                <p>Domingo 17 Mayo 07:00 am - 8:30 am</p>
            </header>
            <section className="info-section">
                <div className="info-card">
                    <h2>Información</h2>
                    <p><strong>Destino:</strong> Polobaya - Arequipa</p>
                    <p><strong>D. Turno:</strong> 1A</p>
                    <p><strong>Fecha:</strong> 17 de mayo del 2023</p>
                    <p><strong>Bus:</strong> ABC-123</p>
                </div>
                <div className="driver-card">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7I7HyE4katbJHadjFl6NyQF9oFqqnBHbGGA&s" alt="Conductor" width='300px' height='400px' />
                    <h2>José Manuel Jaita Chura</h2>
                    <p><strong>ID:</strong> 088213213</p>
                </div>
            </section>
            <section className="bus-info">
                <p><strong>Placa de Bus:</strong> ABC-123</p>
                <p><strong>ID Bus:</strong> Tr09287</p>
            </section>
            <nav className="bottom-nav">
                <button>Perfil</button>
                <button>Turno</button>
                <button>Ruta</button>
                <button>Login</button>
            </nav>
        </div>
    );
}

export default WorkerView;