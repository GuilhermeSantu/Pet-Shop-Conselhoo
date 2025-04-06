// ============================
// FUNÇÕES DE COOKIES
// ============================

function setCookie(nome, valor, dias) {
    let data = new Date();
    data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000));
    let expira = "expires=" + data.toUTCString();
    document.cookie = nome + "=" + valor + "; " + expira + "; path=/";
}

function getCookie(nome) {
    let nomeEQ = nome + "=";
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(nomeEQ) === 0) return c.substring(nomeEQ.length, c.length);
    }
    return null;
}

function deleteCookie(nome) {
    document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// ============================
// CADASTRO DE USUÁRIO
// ============================

function savecad() {
    const name = document.getElementById("register-username").value;
    const emailc = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirm_password = document.getElementById("register-confirm-password").value;

    if (name) setCookie("user", name, 7);
    if (emailc) setCookie("emailc", emailc, 7);
    if (confirm_password) setCookie("confirm_password", confirm_password, 7);

    if (password === confirm_password) {
        setCookie("password", password, 7);
        window.location.href = "index.html";
    } else {
        alert("As senhas não conferem");
        deleteCookie("user");
        deleteCookie("emailc");
        deleteCookie("password");
        deleteCookie("confirm_password");
    }
}

// ============================
// LOGIN
// ============================

function conferirdados() {
    const emailsalvo = getCookie("emailc");
    const senhasalva = getCookie("password");

    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-password").value;

    if (email === emailsalvo && senha === senhasalva) {
        window.location.href = "index.html";
    } else {
        alert("Senha ou email incorretos");
    }
}

// ============================
// VERIFICAR EMAIL PARA TROCA DE SENHA
// ============================

function verificaremail() {
    const emailsalvo = getCookie("emailc");
    const email = document.getElementById("login-email").value;

    if (email === emailsalvo) {
        alert("Email enviado!");

        // Verifica se o campo já foi adicionado para evitar duplicação
        if (!document.getElementById("codigo-de-acesso")) {
            criarCampoComBotao();
        }
    } else {
        alert("Email não encontrado.");
    }

    function criarCampoComBotao() {
        const div = document.createElement("div");
        div.className = "nova-div";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Digite o código de acesso";
        input.name = "campo[]";
        input.id = "codigo-de-acesso";

        const botao = document.createElement("button");
        botao.type = "button";
        botao.textContent = "Verificar Código";
        botao.className = "botao-entrar";
        botao.onclick = verificarcodigo;

        div.appendChild(input);
        div.appendChild(botao);

        document.getElementById("container").appendChild(div);

       
    }

    function verificarcodigo() {
        const codigo = document.getElementById("codigo-de-acesso").value;
        if (codigo === "123456") {
            deleteCookie("password");
            deleteCookie("confirm_password");
            window.location.href = "criarnovasenha.html";
        } else {
            alert("Código errado");
        }
    }
}


// ============================
// NOVA SENHA
// ============================

function novasenha() {
    const password = document.getElementById("nova-senha").value;
    const confirm_password = document.getElementById("conf-nova-senha").value;

    if (confirm_password) {
        setCookie("confirm_password", confirm_password, 7);
    }

    if (password === confirm_password) {
        setCookie("password", password, 7);
        window.location.href = "index.html";
    } else {
        alert("As senhas não batem");
        deleteCookie("password");
        deleteCookie("confirm_password");
    }
}

// ============================
// CARRINHO
// ============================

// Função que salva os cookies e redireciona pro carrinho
function getitens() {
    const preco = document.getElementById("precoproduto").innerText;
    const produto = document.getElementById("nomeproduto").innerText;

    setCookie("preco", preco, 7);
    setCookie("produto", produto, 7);

    window.location.href = "carrinho.html";
}

// Função que exibe os itens no carrinho
function exibirarraynocarrinho() {
    const nome = getCookie("produto");
    const preco = getCookie("preco");

    const container = document.getElementById("itensnocarrinho");
    const botoes = document.getElementById("botoes-carrinho");

    if (!nome || !preco) {
        container.innerHTML = `<p>Seu carrinho está vazio.</p>`;
        if (botoes) botoes.style.display = "none";
        return;
    }

    const precoNumerico = parseFloat(preco.replace("R$", "").replace(",", "."));

    const listaproduto = `
        <div class="produto-item">
            <p><strong>${nome}</strong></p>
            <p>Preço unitário: R$ ${preco}</p>
            <label for="quantidade">Quantidade:</label>
            <input type="number" id="quantidade" min="1" value="1">
            <p id="total">Total: R$ ${preco}</p>
        </div>
    `;

    container.innerHTML = listaproduto;
    if (botoes) botoes.style.display = "flex";

    const inputQtd = document.getElementById("quantidade");
    const totalEl = document.getElementById("total");

    inputQtd.addEventListener("input", () => {
        const qtd = parseInt(inputQtd.value) || 1;
        const total = (precoNumerico * qtd).toFixed(2);
        const totalFormatado = "R$ " + total.replace(".", ",");
        totalEl.textContent = `Total: ${totalFormatado}`;
    });
}

// Só roda o código se for a página do carrinho

        window.onload = function () {
            exibirarraynocarrinho();

            const removerBtn = document.getElementById("remover-produto");
            const finalizarBtn = document.getElementById("finalizar-compra");

            if (removerBtn) {
                removerBtn.onclick = function () {
                    deleteCookie("produto");
                    deleteCookie("preco");
                    document.getElementById("itensnocarrinho").innerHTML = `<p>Seu carrinho está vazio.</p>`;
                    document.getElementById("botoes-carrinho").style.display = "none";
                };
            }

            if (finalizarBtn) {
                finalizarBtn.onclick = function () {
                    alert("Compra finalizada com sucesso!");
                    deleteCookie("produto");
                    deleteCookie("preco");
                    document.getElementById("itensnocarrinho").innerHTML = `<p>Seu carrinho está vazio.</p>`;
                    document.getElementById("botoes-carrinho").style.display = "none";
                };
            }
        };
    

