import React, { useState, useEffect, useMemo} from 'react';
import { useGame } from '../GameContext';
import './Jogo.css';
import EsqBase from "../Imgs/EsqBase.png"
import EsqAtacando from "../Imgs/EsqAtacando.png"
import EsqEscudo from "../Imgs/EsqDef.png"
import EsqMorto from "../Imgs/EsqMort.png"
import OniBase from "../Imgs/oniBase.png"
import OniAtacando from "../Imgs/oniAtk.png"
import OniMorto from "../Imgs/oniMorto.png"
import SlimeBase from "../Imgs/slime.png"
import GuerreirinhoPadrao1 from "../Imgs/BaseGuerreir001.png"
import GuerreirinhoAtacando1 from "../Imgs/GuerreiroAtacand001.png";
import GuerreirinhoDefendendo1 from "../Imgs/GuerreiroDef001.png";
import GuerreirinhoMorto1 from "../Imgs/GuerreirinhoMort001.png";
import GuerreirinhoPadrao2 from "../Imgs/BaseGuerreir002.png"
import GuerreirinhoAtacando2 from "../Imgs/GuerreiroAtacand002.png";
import GuerreirinhoDefendendo2 from "../Imgs/GuerreiroDef002.png";
import GuerreirinhoMorto2 from "../Imgs/GuerreirinhoMort002.png";
import GuerreirinhoPadrao3 from "../Imgs/BaseGuerreir003.png"
import GuerreirinhoAtacando3 from "../Imgs/GuerreiroAtacand003.png";
import GuerreirinhoDefendendo3 from "../Imgs/GuerreiroDef003.png";
import GuerreirinhoMorto3 from "../Imgs/GuerreirinhoMort003.png";
import GuerreirinhoPadrao4 from "../Imgs/BaseGuerreir004.png"
import GuerreirinhoAtacando4 from "../Imgs/GuerreiroAtacand004.png";
import GuerreirinhoDefendendo4 from "../Imgs/GuerreiroDef004.png";
import GuerreirinhoMorto4 from "../Imgs/GuerreirinhoMort004.png";
import GuerreirinhoPadrao5 from "../Imgs/BaseGuerreir005.png"
import GuerreirinhoAtacando5 from "../Imgs/GuerreiroAtacand005.png";
import GuerreirinhoDefendendo5 from "../Imgs/GuerreiroDef005.png";
import GuerreirinhoMorto5 from "../Imgs/GuerreirinhoMort005.png";
import Coliseu from "../Imgs/Coliseu.png"
import EnergImg1 from "../Imgs/EnergImg1.png"; // img raio cheio
import EnergImg2 from "../Imgs/EnergImg2.png"; // img raio metade
import EnergImg3 from "../Imgs/EnergImg3.png"; // img raio vazio
import slimeMorto from '../Imgs/slimeMorto.png'

const Jogo = ({ usuario, mudarNoClient,atualizalobby}) => {
  const statusPartida= JSON.parse(localStorage.getItem(usuario)); 
  const { startGame, endGame } = useGame();
  useEffect(() => {
    startGame(); // Começa o jogo quando o componente é montado

    return () => {
      endGame(); // Finaliza o jogo quando o componente é desmontado
    };
  }, [startGame, endGame]); 
  
  const armadura = statusPartida.Status.Armadura;
  const vidaInicial = parseInt(statusPartida.Vida);
  const vidaMaxima = parseInt(statusPartida.VidaMaxima);
  const fase = statusPartida.Fase;
  const vezesFase = statusPartida.VezesFase[fase-1]
  const nivel = statusPartida.Nivel;
  const danoJogador = statusPartida.Status.Dano;
  const bonusEnergia = statusPartida.BonusRegenEnergia; // ajustar valores depois
  const [danoDado,setDanoDado] = useState([statusPartida.DanoDado]);
  const [danoTomado,setDanoTomado] = useState([statusPartida.DanoTomado]);
  const [score, setScore] = useState(statusPartida.Score);
  const enemy = statusPartida.Inimigo
  let Elmo = statusPartida.Elmo
  let Bencao = statusPartida?.Bencao
  const [rouboDeVida,setRouboDeVida]=useState(0)
  const [regeneracao,setRegeneracao]=useState(false)
  const [vitalidade,setVitalidade]=useState(false)
  const [MEconomico,setMEconomico]=useState(false)
  

  const GuerreirinhoPadrao = {
    1: GuerreirinhoPadrao1,
    2: GuerreirinhoPadrao2,
    3: GuerreirinhoPadrao3,
    4: GuerreirinhoPadrao4,
    5: GuerreirinhoPadrao5
  }[Elmo];

  const GuerreirinhoAtacando = {
    1: GuerreirinhoAtacando1,
    2: GuerreirinhoAtacando2,
    3: GuerreirinhoAtacando3,
    4: GuerreirinhoAtacando4,
    5: GuerreirinhoAtacando5,
  }[Elmo];

  const GuerreirinhoDefendendo = {
    1: GuerreirinhoDefendendo1,
    2: GuerreirinhoDefendendo2,
    3: GuerreirinhoDefendendo3,
    4: GuerreirinhoDefendendo4,
    5: GuerreirinhoDefendendo5
  }[Elmo];

  const GuerreirinhoMorto = {
    1: GuerreirinhoMorto1,
    2: GuerreirinhoMorto2,
    3: GuerreirinhoMorto3,
    4: GuerreirinhoMorto4,
    5: GuerreirinhoMorto5
  }[Elmo];

  //bonusElmoBranca // +30% de xp //1
  //bonusElmoVermelha// +15% de dano do jogador//2
  //bonusElmoVerde// cura 1*(nivel/2) de vida por segundo //3
  //bonusElmoRoxo// ataque e defesa do jogador aplicam veneno que causa o valor de nivel em porcentagem ao longo de 4 segundos//4
  //bonusElmoPreto// -1 ou 2 de vida por segundo, mas ganha essa msm qunatidade//5


  function setMonsterAttributes(enemy) {
    let monstroBase, monstroMorto, monstroAtacando, chanceEsqDefesa, vidaMonstroInicial, tempoAtk, danoMonstro;

    switch(enemy) {
      case 'Slime':
        monstroBase = SlimeBase;
        monstroMorto = slimeMorto;
        monstroAtacando = SlimeBase;
        chanceEsqDefesa = 0;
        vidaMonstroInicial = 130 + 120 * (fase-1) + 35 * (vezesFase) ;
        tempoAtk = Math.max(0, 12 - 4 * (fase - 1) - 2 * (vezesFase ));
        danoMonstro = 15 + 10 * (fase-1) + 3 * (vezesFase-1);
        break;
      case 'Esqueleto':
        monstroBase = EsqBase;
        monstroMorto = EsqMorto;
        monstroAtacando = EsqAtacando;
        chanceEsqDefesa = 0.30 + ((fase - 1) * 0.10);
        vidaMonstroInicial = 120 + 30 * (fase-1) + 20 * (vezesFase-1);
        tempoAtk = Math.max(0, 12 - 4 * (fase - 1) - 2 * (vezesFase ));
        danoMonstro = 20 + 12* (fase-1) + 4 * (vezesFase);
        break;
      case 'Oni':
        monstroBase = OniBase;
        monstroMorto = OniMorto;
        monstroAtacando = OniAtacando;
        chanceEsqDefesa = 0;
        vidaMonstroInicial = 700 + 120 * (fase-1) + 300 * (vezesFase);
        tempoAtk = 5;
        danoMonstro = 110;
        break;
      default:
        monstroBase = 'unknownBase';
        monstroMorto = 'unknownMorto';
        monstroAtacando = 'unknownAtacando';
        chanceEsqDefesa = 0;
        vidaMonstroInicial = 100;
        tempoAtk = 12;
        danoMonstro = 20;
        break;
    }

    return { monstroBase, monstroMorto, monstroAtacando, chanceEsqDefesa, vidaMonstroInicial, tempoAtk, danoMonstro };
  }

  const { monstroBase, monstroMorto, monstroAtacando, chanceEsqDefesa, vidaMonstroInicial, tempoAtk, danoMonstro } = setMonsterAttributes(enemy);

  const initialHeight = 472; 
  const initialWidth = 337;
  const  esqT = "esqTMedio"

   
      //-------
   
     const [vida, setVida] = useState(vidaInicial);
     const [monstroHp, setMonstroHp] = useState(vidaMonstroInicial);//VER
     const [count, setCount] = useState(tempoAtk);
     const [Energ, setEnerg] = useState(100);
     const [currentIndex, setCurrentIndex] = useState(0);
     const [ataqueOcorrendo,setAtaqueOcorrendo ] = useState(false);
     const [Escudo, changeEscudo] = useState(false);
     const [direction, setDirection] = useState(1); // 1 para frente, -1 para trás
     let inimigoVivo = monstroHp > 0;
     let acaoOcorrendo;
     if(ataqueOcorrendo===true || Escudo===true){acaoOcorrendo=true}
     let condicaoCont = vida>0 && inimigoVivo
     const [condicaoContainer,clearContainer]=useState(true)
     const [ImgMonstro, setMonstroImg] = useState(monstroBase); // ver
     const [ImgGuerreirinho,setGurreirinhoImg]=useState(GuerreirinhoPadrao)
     const[guerreirinhoAtk,setGuerreirinhoAtk]=useState(false)
     const[monstroAtk,setMonstroAtk]=useState(false)
     const[EsqDefesa,setEsqDefesa]=useState(false)
     let numeroAleatorio = Math.floor(Math.random() * 5) + tempoAtk;
     let tempoBarra = 700-100*fase                                                          
     const [divPreta, setDivPreta] = useState(4);
     const [errosBarra,setErrosBarra]=useState(0)
     let custoEnegAtk = !vitalidade? 38+2*fase - bonusEnergia*6 :Math.ceil(38+1.2)*fase - bonusEnergia*6 
     let custoEnergDef = !vitalidade? 18+2*fase - bonusEnergia*5:Math.ceil(18+1.2)*fase - bonusEnergia*5
    const calculoDefesa = Math.random() <= chanceEsqDefesa;
    let regenEnerg= !vitalidade?2500 - ((bonusEnergia+1)*350) : 3000 - ((bonusEnergia+1)*500)
    const [viradoG, setViradoG] = useState(false);
    const [viradoE, setViradoE] = useState(false);
    const [condicaoPJogo,setCondicaoPJogo]=useState(true)
    const [DanoJogador,setDanoJogador]=useState(danoJogador)
    
   
    if(custoEnegAtk<5){
     custoEnegAtk=5
    }
    if(custoEnergDef<5){
     custoEnergDef=5
    }
    const [bonusXp,setBonusXp]=useState(0)
    useEffect(() => {
      if (Bencao[0] === 'Roubo de Vida' || Bencao[1] === 'Roubo de Vida') {
        setRouboDeVida(9 * nivel * 1 / 100);
      }
    }, [Bencao, nivel]); // Isso só será executado quando Bencao ou nivel mudarem
    
    useEffect(() => {
      if (Bencao[0] === 'Regeneração' || Bencao[1] === 'Regeneração') {
        setRegeneracao(true);
      } else {
        setRegeneracao(false); // Para garantir que este estado seja limpo quando necessário
      }
    }, [Bencao]);
    
    useEffect(() => {
      if (Bencao[0] === 'Vitalidade' || Bencao[1] === 'Vitalidade') {
        setVitalidade(true);
      } else {
        setVitalidade(false);
      }
    }, [Bencao]);
    
    useEffect(() => {
      if (Bencao[0] === 'Milagre Econômico' || Bencao[1] === 'Milagre Econômico') {
        setMEconomico(true);
      } else {
        setMEconomico(false);
      }
    }, [Bencao]);
    
useEffect(() => {
  let intervalId;
  
  if (Elmo === 5 && !regeneracao && vida < vidaMaxima) {
    intervalId = setInterval(() => {
      setVida(prevVida => prevVida + Math.ceil(nivel));
    }, 2000);
  } else if (Elmo !== 5 && regeneracao && vida < vidaMaxima) {
    intervalId = setInterval(() => {
      setVida(prevVida => prevVida + Math.ceil(nivel / 2));
    }, 2000);
  } else if (Elmo === 5 && regeneracao && vida < vidaMaxima) {
    intervalId = setInterval(() => {
      setVida(prevVida => prevVida + 3 * Math.ceil(nivel));
    }, 2000);
  }
  
  return () => clearInterval(intervalId);
}, [Elmo, regeneracao, nivel, vida]);

useEffect(() => {
  if (Elmo === 2) {
    setDanoJogador(prevDano => prevDano * (1.25 + (0.10 * nivel)));
  }
}, [Elmo, nivel]);

useEffect(() => {
  if (Elmo === 3 && ataqueOcorrendo) {
    const timeouts = [
      setTimeout(() => {
        setMonstroHp(prevVida => prevVida - Math.floor(vidaMonstroInicial * 1 / 100));
      }, 1000),
      setTimeout(() => {
        setMonstroHp(prevVida => prevVida - Math.floor(vidaMonstroInicial * 2 / 100));
      }, 2000),
      setTimeout(() => {
        setMonstroHp(prevVida => prevVida - Math.floor(vidaMonstroInicial * 3 / 100));
      }, 3000)
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }
}, [Elmo, ataqueOcorrendo, vidaMonstroInicial]);

useEffect(() => {
  if (Elmo === 1) {
    setBonusXp(Math.ceil((fase * 100 + 20 * vezesFase) * 1 / 4));
  }
}, [Elmo, fase, vezesFase]);

useEffect(() => {
  if (Elmo === 4) {
    const intervalId = setInterval(() => {
      const numeroAleatorio = Math.floor(Math.random() * nivel) + 1;
      setVida(prevVida => prevVida - numeroAleatorio);
      setDanoJogador(prev => prev + numeroAleatorio);
    }, 1500);

    return () => clearInterval(intervalId);
  }
}, [Elmo, nivel]);


    const adicionarScore=(addScore)=>{
      setScore((prev)=>prev+Math.ceil((addScore*fase/2)))
    }

   
   // Lógica para o ataque do inimigo
   const AtkMonstro = () => {
     const metadeDanoMonstro = danoMonstro / 2;
     const batidaMonstro = Math.floor(Math.random() * (danoMonstro - metadeDanoMonstro + 1) + metadeDanoMonstro);
   
     // Equação de mitigação de dano baseada na armadura do jogador
     const K = 100; // Você pode ajustar esse valor conforme necessário
     const mitigacaoDano = 0.9 * (armadura / (armadura + K));
     const danoFinal =  Math.floor(batidaMonstro * (1 - mitigacaoDano));
     if(!Escudo){
      setVida((prev)=>prev-danoFinal)
      setDanoTomado((prev)=>[...prev,danoFinal])
     }
     
     const hpSpan = document.getElementById("HpSpan");
     if (hpSpan && Escudo !== true) {
       hpSpan.classList.remove("swing"); // Resetando a animação
       void hpSpan.offsetWidth; // Forçando o reflow para reiniciar a animação
       hpSpan.classList.add("swing"); // Adicionando a classe para iniciar a animação
     }
   setTimeout(()=>{setViradoE(true)},100)
   setTimeout(()=>{setViradoE(false)},800)
   
   };

   
    useEffect(() => {
       const intervalId = setInterval(() => {
         setCount((count) => count - 1);
         if (-1 === count){setCount(numeroAleatorio)}
         if (inimigoVivo && -1 === count) {
           AtkMonstro();
           
         }
       }, 900);
       if (inimigoVivo && 0 === count){
         setMonstroAtk(true);
           setTimeout(()=>{
             setMonstroAtk(false)
           },2000)
       }
       return () => clearInterval(intervalId);
     }, [count, inimigoVivo]);
   
   // Lógica para a defesa com escudo
     const DefesaEscudo = () => {
       changeEscudo(true);
       setEnerg((prev) => prev - custoEnergDef);
       adicionarScore(100);
       setGurreirinhoImg(GuerreirinhoDefendendo)
       setTimeout(() => {
         changeEscudo(false);
         setGurreirinhoImg(GuerreirinhoPadrao)
       }, 2000);
     };
     useEffect(() => {
       function handleKeyDown(event) {
         if(!acaoOcorrendo){
         if (event.code === 'Space' && Energ >= custoEnergDef) {
           DefesaEscudo();
         }
         if (event.code === 'Space' && Energ < custoEnergDef) {
          setEnergiaBaixa(true);  // Aciona a animação de energia baixa
          setTimeout(() => setEnergiaBaixa(false), 1000); // Remove a animação após 1 segundo
        }
        }
       }
   
       window.addEventListener('keydown', handleKeyDown);
   
       return () => {
         window.removeEventListener('keydown', handleKeyDown);
       };
     }, [Energ,acaoOcorrendo]);
   
     // Lógica para exibir a energia do jogador
const exibirEnerg = () => {
  const quantidadeImgs1 = Math.floor(Energ / 10); // Quantidade de maçãs inteiras
  const temImgs2 = Energ % 10 !== 0; // Verifica se há maçã não concluída
  const quantidadeImgs3 = 10 - (quantidadeImgs1 + (temImgs2 ? 1 : 0)); // Maçãs que não estão completas

  const imgs1 = Array.from({ length: quantidadeImgs1 }, (_, index) => (
    <img
      key={index}
      src={EnergImg1}
      alt="EnergImg1"
      className={energiaBaixa ? 'animacao-energia-baixa' : ''}
    />
  ));
  const img2 = temImgs2 ? (
    <img
      src={EnergImg2}
      alt="EnergImg2"
      className={energiaBaixa ? 'animacao-energia-baixa' : ''}
    />
  ) : null;
  const imgs3 = Array.from({ length: quantidadeImgs3 }, (_, index) => (
    <img
      key={index}
      src={EnergImg3}
      alt="EnergImg3"
      className={energiaBaixa ? 'animacao-energia-baixa' : ''}
    />
  ));

  return (
    <div>
      {imgs1}
      {img2}
      {imgs3}
    </div>
  );
};

   
    
   
   // Lógica para mudar a imagem do inimigo com base na vida                                                           
     useEffect(() => {
       if(EsqDefesa){setMonstroImg(EsqEscudo)
         setTimeout(()=>{setEsqDefesa(false)
           setMonstroImg(monstroBase)
       },2000)
       }
     }, [EsqDefesa]);
   
     useEffect(() => {
       if(monstroAtk){setMonstroImg(monstroAtacando)
         setTimeout(()=>{if(monstroHp>0){
           setMonstroImg(monstroBase)}
       },2000)
       }
     }, [monstroAtk]);
   
     useEffect(()=>{
       if(monstroHp<=0){
         setMonstroImg(monstroMorto)
       }
     },[monstroHp])
   
   
     // Lógica para mudar a imagem do jogador quando a vida chega a zero
     useEffect(()=>{
       if(vida<=0){
       setGurreirinhoImg(GuerreirinhoMorto)
     }
     },[vida])
   
    
   
     // Utilize o useMemo para inicializar o arrayItens apenas uma vez
     const arrayItens = useMemo(() => ['', '', '', '', '', '', '', '', ''], []);
   
     // Lógica para avançar e retroceder na barra de jogo
     useEffect(() => {
       const intervalID = setInterval(() => {
         setCurrentIndex((prevIndex) => {
           let nextIndex = prevIndex + direction; 
           if (nextIndex >= arrayItens.length - 1) {
             
             setDirection(-1);
           } else if (nextIndex < 1) {
             
             setDirection(1);
           }
           return nextIndex;
         });
       }, tempoBarra);
   
       return () => clearInterval(intervalID);
     }, [arrayItens, direction,tempoBarra]); 
   
     // Lógica para aumentar a energia
     useEffect(() => {
       const energyInterval = setInterval(() => {
         setEnerg((prevEnerg) => {
           const nextEnerg = prevEnerg + 5;
           return nextEnerg >= 100 ? 100 : nextEnerg; // Limite máximo de 100 para Energ
         });
       }, regenEnerg); // Incrementa a cada 500 milissegundos
   
       return () => clearInterval(energyInterval);
     }, []);
   
     // Lógica para lidar com o ataque do jogador e do inimigo
     useEffect(()=>{
       if(guerreirinhoAtk===true&&monstroAtk===true){
         setGuerreirinhoAtk(false)
       }
       else if(guerreirinhoAtk===true){
         setTimeout(() => {
           setViradoG(true)
         }, 1400);
         setTimeout(()=>{setGuerreirinhoAtk(false)
           setGurreirinhoImg(GuerreirinhoPadrao)
         },1500)
         setTimeout(() => {
           setViradoG(false)
         }, 2100);
       }
     },[guerreirinhoAtk,monstroAtk])

     const [BonusME,setBonusME]= useState(0)
     
     const [energiaBaixa, setEnergiaBaixa] = useState(false);

     // Lógica para lidar com o ataque do jogador
     const verificarClick = () => {if(Energ>=custoEnegAtk){
       if (currentIndex === divPreta) {
         setMonstroHp((prev) => Math.floor(prev - DanoJogador));
         setDanoDado((prev)=>[...prev,Math.floor(DanoJogador)])
         setDivPreta(Math.floor(Math.random() * 9));
         setEnerg((prevEnerg) => prevEnerg - custoEnegAtk/2);
         if(rouboDeVida>0 && vida<vidaMaxima){
          setVida(Elmo!==5?(prev)=>prev+Math.ceil(DanoJogador*rouboDeVida):(prev)=>prev+Math.ceil(DanoJogador*rouboDeVida)*2)} 
         if(MEconomico){
          const chance = Math.floor(Math.random() * 4);
          if (chance === 0) {setBonusME((prev)=>prev+ (2 * nivel))}
         }
         adicionarScore(200);
       } else {
         setErrosBarra((prev)=>prev+1);
         setEnerg((prevEnerg) => prevEnerg - custoEnegAtk);
         if (calculoDefesa) { // 
           setEsqDefesa(true);
         } else {
           setMonstroHp((prev) => Math.floor(prev - DanoJogador / 3));
           setDanoDado((prev)=>[...prev,Math.floor(DanoJogador/3)])
           if(rouboDeVida>0){setVida(Elmo!==5?(prev)=>prev+Math.ceil((DanoJogador/rouboDeVida))/3:(prev)=>prev+Math.ceil((DanoJogador/rouboDeVida)))}
           adicionarScore(70);
         }
       }
   
       const hpMonstroSpan = document.getElementById("HpEsqSpan");
   if (hpMonstroSpan && EsqDefesa===false) {
     hpMonstroSpan.classList.remove("swing"); // Resetando a animação
     void hpMonstroSpan.offsetWidth; // Forçando o reflow para reiniciar a animação
     hpMonstroSpan.classList.add("swing"); // Adicionando a classe para iniciar a animação
   }
   setAtaqueOcorrendo(true);
   setGurreirinhoImg(GuerreirinhoAtacando)
   setGuerreirinhoAtk(true)
   setTimeout(() => {
     setGurreirinhoImg(GuerreirinhoPadrao)
     setAtaqueOcorrendo(false);
   }, 2400);
     }else {
      setEnergiaBaixa(true);  // Aciona a animação de energia baixa
      setTimeout(() => setEnergiaBaixa(false), 1000); // Remove a animação após 1 segundo
    }

     };
     if(errosBarra===2){
       setDivPreta(Math.floor(Math.random() * 9));
       setErrosBarra(0)
     }

     useEffect(()=>{
      if(vida<=0||!inimigoVivo)setCondicaoPJogo(false)
     },[vida,inimigoVivo])

     if(Energ<5){setEnerg(5)}
   
     const larguraVida = vida <= 0 ? '0' : `${(vida / vidaMaxima) * 100}%`;
     const larguraVidaEsq = monstroHp <= 0 ? '0' : `${(monstroHp / vidaMonstroInicial) * 100}%`;


    const valorFinalDado = danoDado.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    const valorFinalTomado = danoTomado.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    const calculadoXp = fase*100+20*vezesFase+ bonusXp
    
   
     useEffect(() => {
      if (!condicaoPJogo) {
       
        setTimeout(() => {
          clearContainer(false);
        }, 1500);
        setTimeout(() => {
          mudarNoClient(fase,vida,valorFinalDado,score,calculadoXp,valorFinalTomado, BonusME) 
          atualizalobby(true)
         }, 2000);
        
      }
    }, [condicaoPJogo]);
    
  
     return (
       <div>
         {condicaoContainer && (<div id="vidas">
           <div id="Hp">
           <span id="HpSpan" className="swing">❤️</span><div className="life-bar">
         <div className="inner-bar" style={{ width: larguraVida }}></div>
       </div>
       <p className='valorVida'>{vida}/{vidaMaxima}</p>
       </div>
       <div id="EsqHp">
       <span id="HpEsqSpan" className="swing">💀</span><div className="life-bar">
         <div className="inner-bar" style={{ width: larguraVidaEsq }}></div>
       </div>
       <p className='valorVida'>{monstroHp}/{vidaMonstroInicial}</p>
       </div>
         </div>
           )}
   
   {condicaoContainer && (
     <section className="container">
       <img src={Coliseu} alt="Coliseu" id="coliseu" />
       <img src={ImgGuerreirinho} alt="Guerreirinho" className='guerreirinho' id={guerreirinhoAtk ? "guerreirinhoMovendo" : "guerreirinho"}  style={{
           transform: `translateY(-50%) ${viradoG ? 'scaleX(-1)' : ''}`, 
           height: `${initialHeight * (1 - (fase * 0.09))}px`, 
           width: `${initialWidth * (1 - (fase * 0.09))}px`,
           bottom: `${8+2*fase}%`
         }}/>
       <img src={ImgMonstro} alt="Esqueleto" className={`esqueleto ${esqT}`} id={monstroAtk ? "esqueletoMovendo" : "esqueleto"} style={{transform: `translateY(-50%) ${viradoE ?'scaleX(-1)' : ''}`}}/> 
       
       {condicaoCont && <div id="contador">{count > 0 ? count : "ATAQUE"}</div>}
       
     </section>
   )}
   
         
   
         {condicaoPJogo && (
           <section id="barraDeJogo" className="container">
             <div id="energia">
               {exibirEnerg()} 
             </div>
             <div id="barra">
           <div id="botao">
             {arrayItens.map((item, index) => (
               <div
                 key={index}
                 className={`item ${currentIndex === index ? 'amarelo' : ''} ${
                   currentIndex !== divPreta && index === divPreta ? 'preto' : ''
                 }`}
               ></div>
             ))}
           </div>
           <button id="buttonverificar" onClick={verificarClick} disabled={Energ<10||acaoOcorrendo}>
             Bater
           </button>
         </div>
           </section>
         )}
      
       </div>
     );
   };
  

  

 

export default Jogo;
