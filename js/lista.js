// 1. Selecionando os elementos do HTML que vamos manipular
const formIngrediente = document.getElementById("formIngrediente");
const inputIngrediente = document.getElementById("inputIngrediente");
const inputQuantidade = document.getElementById("inputQuantidade");
const listaItens = document.getElementById("listaItens");
const mensagemVazia = document.getElementById("mensagemVazia");

// 2. Criamos uma lista (Array) na memória para guardar os itens.
// Ela tenta buscar dados já salvos no localStorage. Se não achar nada, começa vazia [].
let meusItens = JSON.parse(localStorage.getItem("itensDespensa")) || [];

// 3. Função para renderizar (desenhar) a lista na tela do usuário
function renderizarLista() {
    // Limpa a lista atual para não duplicar os itens ao redesenhar
    listaItens.innerHTML = "";

    // Controla se exibe a mensagem de "Despensa vazia" ou não
    if (meusItens.length === 0) {
        mensagemVazia.classList.remove("d-none"); // Mostra a mensagem
    } else {
        mensagemVazia.classList.add("d-none"); // Esconde a mensagem
    }

    // Passa por cada item do array e cria o HTML dele
    meusItens.forEach((item, index) => {
        const li = document.createElement("li");

        // Define as classes do Bootstrap para o item da lista
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        // Se o item estiver marcado como comprado, adiciona um fundo cinza claro
        if (item.comprado) {
            li.classList.add("bg-light");
        }

        // Monta a estrutura interna do item (Checkbox + Texto + Botão Excluir)
        li.innerHTML = `
            <div class="d-flex align-items-center">

                <input
                    type="checkbox"
                    class="form-check-input me-3"
                    ${item.comprado ? "checked" : ""}
                    onchange="alternarComprado(${index})">

                <span class="${item.comprado ? "text-decoration-line-through text-muted" : ""}">
                    <strong>${item.nome}</strong> - <small>${item.quantidade}</small>
                </span>

            </div>

            <button
                class="btn btn-sm btn-outline-danger"
                onclick="excluirItem(${index})">

                <i class="bi bi-trash"></i>

            </button>
        `;

        // Adiciona o item criado dentro da tag <ul> do HTML
        listaItens.appendChild(li);
    });
}

// 4. Evento executado quando o usuário clica no botão "Adicionar Item"
formIngrediente.addEventListener("submit", (evento) => {
    evento.preventDefault(); // Impede a página de recarregar com o envio do formulário

    // Captura os valores digitados e remove espaços extras com o .trim()
    const nome = inputIngrediente.value.trim();
    const quantidade = inputQuantidade.value.trim();

    // Verifica se os campos foram preenchidos
    if (nome === "" || quantidade === "") {
        alert("Preencha o ingrediente e a quantidade.");
        return;
    }

    // Cria o objeto do novo item
    const novoItem = {
        nome: nome,
        quantidade: quantidade,
        comprado: false // Todo item novo começa como "não comprado"
    };

    // Adiciona o novo objeto no nosso Array
    meusItens.push(novoItem);

    // Salva a lista atualizada no localStorage
    atualizarLocalStorage();

    // Redesenha a lista na tela para mostrar o novo item
    renderizarLista();

    // Limpa os campos do formulário para a próxima digitação
    formIngrediente.reset();

    // Coloca o cursor de volta no primeiro campo
    inputIngrediente.focus();
});

// 5. Função para marcar/desmarcar o item como comprado
function alternarComprado(index) {
    // Inverte o valor booleano (se era false vira true, se era true vira false)
    meusItens[index].comprado = !meusItens[index].comprado;

    atualizarLocalStorage();
    renderizarLista();
}

// 6. Função para excluir um item da lista
function excluirItem(index) {
    // O método splice remove o item baseado na posição (index) dele no array
    meusItens.splice(index, 1);

    atualizarLocalStorage();
    renderizarLista();
}

// 7. Função utilitária para transformar o Array em texto e salvar no localStorage
function atualizarLocalStorage() {
    localStorage.setItem("itensDespensa", JSON.stringify(meusItens));
}

// 8. Executa a função pela primeira vez assim que a página abre,
// para exibir os itens que já estavam salvos anteriormente.
renderizarLista();