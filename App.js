import { useState } from 'react';
import { BotaoReiniciar } from './Reiniciar';

function Square({ valor, func }) {
  return (
    <button className="square" onClick={func}>
      {valor}
    </button>
  );
}

export default function Campo() {
  const [quadrados, setQuadrados] = useState(Array(9).fill(null));
  const [estado, setEstado] = useState(false);
  const [status, setStatus] = useState(null);

  function calcularVencedor(quadradosTemp) {

    const combinacoes = [
      // Linhas
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      // Colunas
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      // Diagonais
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < combinacoes.length; i++) {
      const [a, b, c] = combinacoes[i];

      if (
        quadradosTemp[a] &&
        quadradosTemp[a] === quadradosTemp[b] &&
        quadradosTemp[a] === quadradosTemp[c]
      ) {

        if (quadradosTemp[a] === "X") {
          return "Jogador 1 venceu!";
        }

        return "Jogador 2 venceu!";
      }
    }

    const empate = quadradosTemp.every(
      (quadrado) => quadrado !== null
    );

    if (empate) {
      return "Deu empate!";
    }

    return null;
  }

  function handleClick(i) {

    // Bloqueia jogadas após o fim da partida
    if (status !== null) {
      return;
    }

    const quadradoTemp = quadrados.slice();

    if (quadradoTemp[i] != null) {
      return;
    }

    if (estado === false) {
      quadradoTemp[i] = "X";
    } else {
      quadradoTemp[i] = "O";
    }

    setQuadrados(quadradoTemp);
    setEstado(!estado);
    setStatus(calcularVencedor(quadradoTemp));
  }

  return (
    <>
      <div>
        <h3>
          {status
            ? status
            : `Vez do jogador: ${estado ? "O" : "X"}`}
        </h3>
      </div>

      <div className="board-row">
        <Square valor={quadrados[0]} func={() => handleClick(0)} />
        <Square valor={quadrados[1]} func={() => handleClick(1)} />
        <Square valor={quadrados[2]} func={() => handleClick(2)} />
      </div>

      <div className="board-row">
        <Square valor={quadrados[3]} func={() => handleClick(3)} />
        <Square valor={quadrados[4]} func={() => handleClick(4)} />
        <Square valor={quadrados[5]} func={() => handleClick(5)} />
      </div>

      <div className="board-row">
        <Square valor={quadrados[6]} func={() => handleClick(6)} />
        <Square valor={quadrados[7]} func={() => handleClick(7)} />
        <Square valor={quadrados[8]} func={() => handleClick(8)} />
      </div>

      <BotaoReiniciar
        setQuadrados={setQuadrados}
        setEstado={setEstado}
        setStatus={setStatus}
      />
    </>
  );
}