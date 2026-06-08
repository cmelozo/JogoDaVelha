import { useState, useEffect } from "react";

function Square({ valor, func, destaque }) {
  return (
    <button
      className={`square ${destaque ? "winner" : ""}`}
      onClick={func}
    >
      {valor}
    </button>
  );
}

export default function Campo() {
  const [quadrados, setQuadrados] = useState(Array(9).fill(null));
  const [estado, setEstado] = useState(false);
  const [status, setStatus] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [winnerSquares, setWinnerSquares] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [vsMachine, setVsMachine] = useState(false);
  const [placar, setPlacar] = useState({
    X:0,
    O:0,
    empate:0
  });

  function calcularVencedor(tabuleiro){
    const linhas = [
      [0,1,2],
      [3,4,5],
      [6,7,8],

      [0,3,6],
      [1,4,7],
      [2,5,8],

      [0,4,8],
      [2,4,6]

    ];

    for(let linha of linhas){
      const [a,b,c]=linha;
      if(
        tabuleiro[a] &&
        tabuleiro[a]===tabuleiro[b] &&
        tabuleiro[a]===tabuleiro[c]
      ){

        return {
          vencedor:tabuleiro[a],
          squares:linha
        };
      }
    }

    if(
      tabuleiro.every(
        item=>item!==null
      )
    ){

      return {
        vencedor:"empate",
        squares:[]
      };

    }
    return null;
  }

  function handleClick(i){
    if(gameOver) return;
    if(quadrados[i]!=null) return;
    let novo = quadrados.slice();
    let jogador;
    if(estado==false){
      jogador="X";
    }
    else{
      jogador="O";
    }

    novo[i]=jogador;
    setQuadrados(novo);
    setHistorico(prev=>[
      ...prev,
      `Jogada ${prev.length+1}: ${jogador} na posição ${i}`
    ]);

    const resultado =
      calcularVencedor(novo);
    if(resultado){
      setGameOver(true);
      if(
        resultado.vencedor==="empate"
      ){
        setStatus("Deu empate!");
        setPlacar(prev=>({
          ...prev,
          empate:
          prev.empate+1

        }));

      }
      else{
        setStatus(
          `Jogador ${resultado.vencedor} venceu!`
        );
        setWinnerSquares(
          resultado.squares
        );
        setPlacar(prev=>({
          ...prev,
          [resultado.vencedor]:
          prev[resultado.vencedor]+1
        }));

      }
      return;
    }
    setEstado(!estado);
  }
  useEffect(()=>{
    if(
      vsMachine &&
      estado==true &&
      !gameOver
    ){
      const livres =
      quadrados
      .map((v,i)=>
        v==null ? i:null
      )
      .filter(v=>v!=null);
      if(livres.length){
        const random =
        livres[
          Math.floor(
            Math.random()*livres.length
          )
        ];
        setTimeout(()=>{
          handleClick(random);
        },500);
      }
    }
  },[
    quadrados,
    estado,
    gameOver,
    vsMachine
  ]);
  function reiniciar(){
    setQuadrados(
      Array(9).fill(null)
    );
    setEstado(false);
    setStatus("");
    setGameOver(false);
    setWinnerSquares([]);
    setHistorico([]);
  }

  function desfazer(){
    if(
      historico.length===0
    ) return;
    let novo =
    quadrados.slice();
    let ultimo =
    novo
    .map((v,i)=>
      v!=null ? i:null
    )
    .filter(v=>v!=null)
    .pop();
    novo[ultimo]=null;
    setQuadrados(novo);
    let novoHist =
    historico.slice();
    novoHist.pop();
    setHistorico(
      novoHist
    );
    setEstado(!estado);
    setGameOver(false);
    setStatus("");
    setWinnerSquares([]);
  }
  return(
    <>
      <h2>
        {
        gameOver
        ? status
        :
        `Vez do jogador: ${
          estado
          ? "O"
          : "X"
        }`
        }
      </h2>
      <h3>
        X: {placar.X}
        |
        O: {placar.O}
        |
        Empates: {placar.empate}
      </h3>
      <div className="board-row">
        {[0,1,2].map(i=>
          <Square
            key={i}
            valor={quadrados[i]}
            destaque={
              winnerSquares.includes(i)
            }
            func={()=>
              handleClick(i)
            }
          />
        )}
      </div>
      <div className="board-row">
        {[3,4,5].map(i=>
          <Square
            key={i}
            valor={quadrados[i]}
            destaque={
              winnerSquares.includes(i)
            }
            func={()=>
              handleClick(i)
            }
          />
        )}
      </div>
      <div className="board-row">
        {[6,7,8].map(i=>
          <Square
            key={i}
            valor={quadrados[i]}
            destaque={
              winnerSquares.includes(i)
            }
            func={()=>
              handleClick(i)
            }
          />
        )}
      </div>
      <br/>
      <button onClick={reiniciar}>
        Reiniciar
      </button>
      <button onClick={desfazer}>
        Desfazer
      </button>
      <button
        onClick={()=>
          setVsMachine(!vsMachine)
        }
      >
        {
        vsMachine
        ?
        "PvP"
        :
        "Contra Máquina"
        }
      </button>
      <h3>Histórico</h3>
      {
      historico.map((item,index)=>
        <p key={index}>
          {item}
        </p>
      )
      }
    </>

  );

}
