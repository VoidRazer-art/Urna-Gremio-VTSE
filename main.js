// === LOGIN SEGURO ===

const telaSenha = document.getElementById("telaSenha");
const urna = document.getElementById("urna");
const btnEntrar = document.getElementById("btnEntrar");

btnEntrar.addEventListener("click", async () => {
    const digitada = document.getElementById("senhaDigitada").value;

    // VALIDAÇÃO VIA APPS SCRIPT
    const r = await fetch(
        "https://script.google.com/macros/s/AKfycbwNyJ92Unh-TFD3QYz1TbwK117e4mIU9qJqRoFqajADbI5cgQ0XDseDIJHW1_0tG4p2MQ/exec?senha=" + encodeURIComponent(digitada)
    );

    const data = await r.json();

    if (data.autorizado) {
        telaSenha.classList.add("hidden");
        urna.classList.remove("hidden");
    } else {
        alert("Senha incorreta!");
    }
});


// ----------------------------
// LÓGICA DA URNA (original)
// ----------------------------

let numero = "";

const CHAPAS = {
    "11": "Chapa 1",
    "22": "Chapa 2",
    "33": "Chapa 3"
};

function digitar(n) {
    if (numero.length < 2) {
        numero += n;
        document.getElementById("display").value = numero;

        document.getElementById("bip").play();

        if (numero.length === 2) mostrarChapa();
    }
}

function mostrarChapa() {
    const info = document.getElementById("infoChapa");

    if (CHAPAS[numero]) {
        info.innerHTML = `<h3>${CHAPAS[numero]}</h3>`;
    } else {
        info.innerHTML = `<h3>VOTO NULO</h3>`;
    }
}


// ----------------------------
// CONFIRMAR + TELA DE VOTO REGISTRADO
// ----------------------------

async function confirmarVoto() {
    if (numero.length !== 2) return;

    document.getElementById("confirm").play();

    fetch("https://script.google.com/macros/s/AKfycbwNyJ92Unh-TFD3QYz1TbwK117e4mIU9qJqRoFqajADbI5cgQ0XDseDIJHW1_0tG4p2MQ/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voto: numero })
    }).catch(() => {});

    const tela = document.getElementById("votoRegistrado");

    tela.classList.remove("hidden");
    tela.classList.add("ativo");

    setTimeout(() => {
        tela.classList.remove("ativo");
        setTimeout(() => tela.classList.add("hidden"), 300);

        numero = "";
        document.getElementById("display").value = "";
        document.getElementById("infoChapa").innerHTML = "";

    }, 1200);
}


// ----------------------------
// TELA DE VOTO REGISTRADO
// ----------------------------

function mostrarVotoRegistrado() {
    const modal = document.getElementById('voto-registrado');
    modal.classList.add('ativo');

    setTimeout(() => {
        modal.classList.remove('ativo');
        resetarParaTelaInicial();
    }, 2000);
}

