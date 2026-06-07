import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCprtRMzipsccdTqwVGe-ZWayCu95JrPB4",
  authDomain: "extensao-2a56c.firebaseapp.com",
  projectId: "extensao-2a56c",
  storageBucket: "extensao-2a56c.firebasestorage.app",
  messagingSenderId: "942226813201",
  appId: "1:942226813201:web:f8ef22a00f5a4bc04e9cb0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/****************************************************************************************** */
/*Constantes globais*/

let life = 100;
let perguntas = [];
let pergunta = 0;
let pontuacao = 0;
const ceu = document.getElementById("ceu");
const pontos = document.getElementById("pontos")
const tronco = document.getElementById("tronco")
const raizes = document.getElementById("raizes")
const chao = document.getElementById("chao")
const folhas = document.getElementById("folhas")
const yes = document.getElementById("button-yes")
const no = document.getElementById("button-no")
const buttonplay = document.getElementById("btnplay")
const card = document.getElementById("card")
const passaros = document.getElementById("passaros")
const texto = document.getElementById("texto")
const galhos = document.getElementById("galhos")
const estrelas = document.getElementById("estrelas")
const agradecimetos = document.getElementById("agradecimentos")


/*Playback*/
const playback = new Audio("playback.mp3")
playback.loop = true
playback.volume = 1

/*Coin sound*/
const coin = new Audio("coin.mp3")
coin.volume = 0.5

function gameover(life){
    
    switch (life) {
    case 80:
        chao.style.backgroundColor = "rgb(149, 188, 9)"
        break;

    case 60:
        document.getElementById("passaro1").innerHTML = ''
        document.getElementById("passaro2").innerHTML = ''
        document.getElementById("passaro3").innerHTML = ''
        document.getElementById("passaro4").innerHTML = ''
        break;
    case 40:
        ceu.className = ''
        ceu.classList.add("ceu50")
        chao.style.backgroundColor = "rgb(127, 130, 114)"
        for (let index = 1; index < 11; index++) {
            document.getElementById("folha"+index).classList.remove("folhas-cor")
            document.getElementById("folha"+index).classList.add("folhas-sem-cor")
        }
        break;

    case 20:
        folhas.innerHTML = ''
        document.getElementById("galhos").style.display = "flex";
        break;
    case 0:
        playback.pause()
        playback.currentTime = 0;
        ceu.className = ''
        ceu.classList.add("ceu0");
        galhos.parentNode.removeChild(galhos)
        document.querySelectorAll("button").forEach(e => {
            e.disabled = true;
        })

        const p = document.createElement("h2");
        p.innerText = "GAME OVER";
        p.setAttribute("class", "gameover");
        form()

        document.body.appendChild(p);

        document.getElementById("card").style.display = "none"
        folhas.style.display = 'none'
        

        document.getElementById("demonio").style.display = "flex";

        tronco.style.height = "35px"
        tronco.style.marginTop = "806px"

        document.getElementById("passaro1").innerHTML = ''
        document.getElementById("passaro2").innerHTML = ''
        document.getElementById("passaro3").innerHTML = ''
        document.getElementById("passaro4").innerHTML = ''
        document.getElementById("chao").style.backgroundColor = "rgb(85, 85, 89)"
        criarFinal()
        break;
    case -1:
        pergunta = 0
        card.style.backgroundColor = 'red'
        passaros.classList.add('voar')
        folhas.classList.add('folhar')
        tronco.classList.add("desaparecer")
        raizes.classList.add('desaparecer')
        chao.classList.add('desaparecer')
        ceu.classList.add('desaparecer')
        galhos.classList.add('desaparecer')
        yes.style.display = 'none'
        no.style.display = 'none'
        texto.innerHTML = '<p>Você me venceu dessa vez, mas talvez não seus descendentes. <br> <br> <strong>Eu voltarei.<strong> <br>HAHAHAHAHAHAHAHA! <br> <br> <u>POR FAVOR PREENCHAM O FOMULÁRIO ABAIXO, PELO MENOS O NOME E ESCOLA, É PARA A FACULDADE!</u><p>'
        form()
        break
    default:
        break
    }
}

function form(){
    const form = document.createElement('form')
    form.setAttribute('id', 'forme')
    form.innerHTML = '<div><label for="email">Email</label><input type="email" name="email" id="email"></div><div><label for="nome">Nome Completo</label><input type="text" name="nome" id="nome"></div><div><label for="escola">Escola/Faculdade</label><input type="text" name="escola" id="escola"></div><div><label for="feedback">Comentário sobre Jogo/Perguntas</label><textarea name="feedback" id="feedback"></textarea></div><button type="submit" id="enviar">Enviar</button>'
    document.body.appendChild(form)
    form.addEventListener('submit', salvarUsuario);
}

function lifeUp(){
    coin.play()
    let valor = Number(pontos.innerText.toString())
    valor += 125
    pontuacao += 125
    pontos.innerText = valor
    return;
}

async function salvarUsuario(e){
    e.preventDefault();
    const forme = document.getElementById('forme');
    const final = document.getElementById('final');
    const demonio = document.getElementById('demonio');
    card.style.height = 'max-content'
    card.style.justifyContent = 'center'
    forme.style.display = 'none'
    document.body.style.backgroundColor = 'black'
    passaros.parentNode.removeChild(passaros)
    folhas.parentNode.removeChild(folhas)
    tronco.parentNode.removeChild(tronco)
    raizes.parentNode.removeChild(raizes)
    chao.parentNode.removeChild(chao)
    ceu.parentNode.removeChild(ceu)
    galhos.parentNode.removeChild(galhos)
    yes.parentNode.removeChild(yes)
    no.parentNode.removeChild(no)
    final.parentNode.removeChild(final)
    demonio.parentNode.removeChild(demonio)

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const escola = document.getElementById('escola').value; 
    const feedback = document.getElementById('feedback').value;

    try{
        await addDoc(collection(db, "usuarios"), {
            nome,
            email,
            escola,
            feedback,
            pontuacao,
            dataCadastro: new Date()
        });

        texto.innerHTML = 'Obrigado por jogar! <br> Agora a explicação de cada pergunta! <br> <br> A primeira sobre a árvore pertencer ao mesmo solo em que ela foi arrancada: é sobre a <u><strong>causa indígena</strong></u>, eles devem ser reconhecidos como pertecentes ao Brasil, mesmo depois de toda a exploração colonial sobre suas vidas e cultura. <br><br> A segunda sobre a luz ser verdadeira mesmo sem iluminar a todos: é sobre os <u><strong>Direitos Humanos</strong></u>, eles não podem ser direitos garantidos universalmente enquando não assiste a todos do planeta; devemos ter como primeiro direito a garantia de termos direitos. <br> <br> A terceira sobre duas formas de formato iguais e origens diferentes, se são iguais: é sobre a <u><strong>causa afrodescentes</strong></u>, em comparação com os demais, eles são iguais, pois, a sua única diferença é a sua origem. <br> <br> A quarta sobre cuidar do ente querido, é sobre a <u><strong>mãe natureza</strong></u>,você não poderá salvá-la apenas cuidando dela sem realizar atos (ter ação) para isso. <br> <br> A quinta sobre o seu pomar que, também é usados por seus vizinhos, se pertence a eles: é sobre a <u><strong>cultura</strong></u>, as outras pessoas que compartilham da sua cultura também são merecedoras de fazer parte do seu coletivo e de protegê-la juntamente com você. <br> <br> A sexta sobre jogar fora algum dos três objetos que você possui: é sobre o <u><strong>valor potêncial da nossa flora e fauna</strong></u>, pois, há espécies que conhecemos e usamos, as que conhecemos e não usamos, e as desconhecidas, se jogassemos alguma delas fora, iríamos perder itens valiosos para nosso presente e futuro. <br> <br> A sétima sobre a balança, se algum dos dois personagens sobrevive caso um dos dois morra: é sobre <u><strong>você e o meio ambiente</strong></u>, você não sobrevive sem a natureza e nem ela sem a sua ajuda/manutenção. <br> <br> A oitava sobre a porta aberta com sangue, se ela ainda vai ficar aberta sem o auxílio de ninguém: é sobre a <u><strong>garantia dos nossos direitos</strong></u>, mesmo depois de lutarmos para conseguí-la, ela não irá continuar em vigor sem sua reivindicação diariamente.'
    }
    catch(erro){
        console.error(erro);
        alert("Erro ao enviar.");
    }
    finally{
        forme.parentNode.removeChild(forme);
    }
}



/****************************************************************************** */

async function carregarPerguntas() {

  const snapshot = await getDocs(
    collection(db, "extensao")
  );

  snapshot.forEach((doc) => {
    perguntas.push({
      id: doc.id,
      ...doc.data()
    });
  });
 

  mudarPergunta()
}

function mudarPergunta()
{

    if(pergunta < 8 && pergunta > -1){
            
            texto.innerText = perguntas[pergunta]['pergunta']
            
    }
    
}

buttonplay.addEventListener("click", function(){
    playback.play()
    agradecimetos.parentNode.removeChild(agradecimetos)
    chao.style.backgroundColor = ' rgb(139, 236, 34)'
    ceu.classList = 'ceu100'
    estrelas.parentNode.removeChild(estrelas)
    tronco.style.display = 'block'
    folhas.style.display = 'flex'
    yes.style.display = 'flex'
    no.style.display = 'flex'
    raizes.style.display = 'flex'
    buttonplay.style.display = 'none'
    texto.innerText = ''
    passaros.style.display = "flex"
    buttonplay.parentNode.removeChild(buttonplay)
    carregarPerguntas()
})


yes.addEventListener('click', function(){
    if(pergunta >= 8 || pergunta <= -1){
        criarFinal()
        life = -1
        pergunta = -1
        gameover(life)
        return;
    }

    if(perguntas[pergunta]['sim'] == 1){
        lifeUp()
        pergunta = pergunta + 1
        mudarPergunta()
        return;
    }
    life -= 20;
    gameover(life);
    pergunta = pergunta + 1
    mudarPergunta()

    return;
})

no.addEventListener('click', function nao(){
    if(pergunta >= 8 || pergunta <= -1){
        criarFinal()
        life = -1
        pergunta = -1
        gameover(life)
        return;
    }

    if(perguntas[pergunta]['nao'] == 1){
        lifeUp()
        pergunta = pergunta + 1
        mudarPergunta()
        return;
    }
    life -= 20;
    gameover(life);
    pergunta = pergunta + 1
    mudarPergunta()
    return;
})

function criarFinal(){
    const textoFinal = document.createElement('p')
    textoFinal.setAttribute('id', 'final')
    switch (life) {
        case 100:
            textoFinal.innerText = 'Você salvou o seu mundo! Você é um campeão!'
            break;
        case 80:
            textoFinal.innerText = 'Você salvou o mundo a tempo! Mas a flora foi um pouco afetada!'
            break;
        case 60:
            textoFinal.innerText = 'Você salvou o mundo! Mas afetou a flora e matou a fauna! Foi uma grande perca!'
            break;
        case 40:
            textoFinal.innerText = 'Você salvou o mundo! Mas quase matou a flora, matou a fauna e poluiu a atmosfera! Foi uma grande perca!'
            break;
        case 20:
            textoFinal.innerText = 'Você salvou o mundo, mas com grandes consequêcias de suas ações! Matou a flora, matou a fauna e poluiu a atmosfera! Foi uma grande perca!'
            break;
        case 0:
            textoFinal.innerText = 'Você não foi capaz de salvar o que você conhece e nem a você mesmo, tudo morreu e foi tomado pelo Demônio! Matou a flora, a fauna, acabou com a atmosfera e tudo o que existia!'
            break;
        default:
            break;
    }
    
    document.body.appendChild(textoFinal)
}
