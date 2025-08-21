import React, { useState } from 'react';
import alunosData from "./alunos.json";
import './index.css';


const calcularMedia = (notas) => {
    const soma = notas.reduce((totalAtual, notaAtual) => totalAtual + (notaAtual || 0), 0);
    if (notas.length > 0) {
        return soma / notas.length;
    } else {
        return 0;
    }
};

const determinarStatus = (aluno) => {
    const notasDoAluno = [aluno.nota_1, aluno.nota_2, aluno.nota_3, aluno.nota_4];
    const media = calcularMedia(notasDoAluno);
    if (media >= 7.0 && aluno.faltas < 7) {
        return 'Aprovado';
    } else {
        return 'Reprovado';
    }
};


function App() {
    const [filtros, setFiltros] = useState({
        nome: '',
        status: 'Todos',
        mediaMin: '',
        faltasMax: ''
    });

    const handleInputChange = (evento) => {
        const { name, value } = evento.target;
        setFiltros(prevFiltros => ({
            ...prevFiltros,
            [name]: value
        }));
    };

    const aplicarPreset = (presetConfig) => {
        setFiltros(presetConfig);
    };


    const alunosFiltrados = alunosData.filter(alunoAtual => {
        const mediaDoAluno = calcularMedia([alunoAtual.nota_1, alunoAtual.nota_2, alunoAtual.nota_3, alunoAtual.nota_4]);
        const statusDoAluno = determinarStatus(alunoAtual);

        const nomeOK = `${alunoAtual.primeiro_nome} ${alunoAtual.ultimo_nome}`
            .toLowerCase()
            .includes(filtros.nome.toLowerCase());

        const statusOK = filtros.status === 'Todos' || statusDoAluno === filtros.status;

        const mediaOK = !filtros.mediaMin || mediaDoAluno >= parseFloat(filtros.mediaMin);

        const faltasOK = !filtros.faltasMax || alunoAtual.faltas <= parseInt(filtros.faltasMax);

        return nomeOK && statusOK && mediaOK && faltasOK;
    });


    return (
        <div className="container">
            <h1>Sistema de Gestão de Alunos</h1>
            
            <div className="filtros-secao">
                <input
                    type="text"
                    placeholder="Filtrar por nome..."
                    name="nome"
                    value={filtros.nome}
                    onChange={handleInputChange}
                    className="campo-filtro"
                />
                <div className="botoes-status">
                    <button onClick={() => setFiltros(prev => ({ ...prev, status: 'Todos' }))}>Todos</button>
                    <button onClick={() => setFiltros(prev => ({ ...prev, status: 'Aprovado' }))}>Aprovados</button>
                    <button onClick={() => setFiltros(prev => ({ ...prev, status: 'Reprovado' }))}>Reprovados</button>
                </div>
            </div>

            <div className="filtros-adicionais">
                <input
                    type="number"
                    placeholder="Média mínima"
                    name="mediaMin"
                    value={filtros.mediaMin}
                    onChange={handleInputChange}
                    className="campo-filtro"
                />
                <input
                    type="number"
                    placeholder="Faltas máximas"
                    name="faltasMax"
                    value={filtros.faltasMax}
                    onChange={handleInputChange}
                    className="campo-filtro"
                />
            </div>

            <div className="presets-secao">
                <h3>Presets de Filtro</h3>
                <div className="presets-botoes">
                    <button onClick={() => aplicarPreset({ nome: '', status: 'Aprovado', mediaMin: '9.0', faltasMax: '0' })}>
                        Alunos Exemplares
                    </button>
                    <button onClick={() => aplicarPreset({ nome: '', status: 'Reprovado', mediaMin: '7.0', faltasMax: '' })}>
                        Reprovados com Média Boa
                    </button>
                    <button onClick={() => aplicarPreset({ nome: '', status: 'Todos', mediaMin: '', faltasMax: '10' })}>
                        Com Muitas Faltas
                    </button>
                </div>
            </div>

            <div className="tabela-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Faltas</th>
                            <th>Média</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunosFiltrados.map(aluno => (
                            <tr key={aluno.id}>
                                <td>{aluno.id}</td>
                                <td>{`${aluno.primeiro_nome} ${aluno.ultimo_nome}`}</td>
                                <td>{aluno.faltas}</td>
                                <td>{calcularMedia([aluno.nota_1, aluno.nota_2, aluno.nota_3, aluno.nota_4]).toFixed(2)}</td>
                                <td>{determinarStatus(aluno)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
