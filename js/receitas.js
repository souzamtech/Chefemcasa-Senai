// Selecionando os elementos do HTML
const campoBusca = document.getElementById("campoBusca");
const botaoBuscar = document.getElementById("botaoBuscar");
const mensagem = document.getElementById("mensagem");
const areaReceitas = document.getElementById("areaReceitas");

// Evento do botão Buscar
botaoBuscar.addEventListener("click", async () => {

    // Remove espaços antes e depois do texto
    const ingrediente = campoBusca.value.trim();

    // Validação do campo
    if (!ingrediente) {
        mensagem.textContent = "Por favor, digite um ingrediente.";
        areaReceitas.innerHTML = "";
        return;
    }

    mensagem.textContent = "Buscando receitas...";
    areaReceitas.innerHTML = "";

    try {

        // Busca receitas pelo ingrediente informado
        const urlFiltro = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`;

        const respostaFiltro = await fetch(urlFiltro);
        const dadosFiltro = await respostaFiltro.json();

        // Caso não encontre receitas digitadas pelo usuário, exibe mensagem de erro
        if (!dadosFiltro.meals) {
            mensagem.textContent = "Nenhuma receita encontrada com esse ingrediente.";
            return;
        }

        mensagem.textContent = "";

        // Exibe somente as 5 primeiras receitas mais buscadas
        const primeirasReceitas = dadosFiltro.meals.slice(0, 5);

        // Para cada receita encontrada
        for (const receita of primeirasReceitas) {

            // Busca os detalhes completos da receita
            const urlDetalhes = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${receita.idMeal}`;

            const respostaDetalhes = await fetch(urlDetalhes);
            const dadosDetalhes = await respostaDetalhes.json();

            const detalhes = dadosDetalhes.meals[0];

            // Cria o card da receita
            const receitaHTML = `
                <div class="card mt-3">
                    <img src="${detalhes.strMealThumb}" class="card-img-top" alt="${detalhes.strMeal}">

                    <div class="card-body">
                        <h3 class="card-title">${detalhes.strMeal}</h3>

                        <p><strong>Categoria:</strong> ${detalhes.strCategory}</p>

                        <p><strong>Modo de preparo:</strong></p>

                        <p>${detalhes.strInstructions}</p>
                    </div>
                </div>
            `;

            areaReceitas.innerHTML += receitaHTML;
        }

    } catch (erro) {

        console.error(erro);

        mensagem.textContent = "Erro ao buscar receitas.";
    }

});