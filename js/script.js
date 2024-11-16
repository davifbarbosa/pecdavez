document.addEventListener("DOMContentLoaded", function() {
    const assinouContainer = document.querySelector("#assinou .parlamentares");
    const naoAssinouContainer = document.querySelector("#nao-assinou .parlamentares");
    const outrosContainer = document.querySelector("#outros .parlamentares");

    // Carregar dados dos parlamentares a partir do CSV usando PapaParse
    Papa.parse("parlamentares.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const parlamentares = results.data;
            configurarFiltros(parlamentares);
            exibirParlamentares(parlamentares, "Brasil Todo", "Total Legislativo");
        },
        error: function(error) {
            console.error("Erro ao carregar CSV:", error);
        }
    });

    function configurarFiltros(parlamentares) {
        const filtros = document.querySelectorAll(".filtro");
        const estadoButtons = document.querySelectorAll(".estado-btn");

        filtros.forEach(filtro => {
            filtro.addEventListener("click", () => {
                filtros.forEach(btn => btn.classList.remove("ativo"));
                filtro.classList.add("ativo");
                const tipo = filtro.textContent.trim();
                const estado = document.querySelector(".estado-btn.ativo") ? document.querySelector(".estado-btn.ativo").dataset.estado : "Brasil Todo";
                exibirParlamentares(parlamentares, estado, tipo);
            });
        });

        estadoButtons.forEach(button => {
            button.addEventListener("click", () => {
                estadoButtons.forEach(btn => btn.classList.remove("ativo"));
                button.classList.add("ativo");
                const estado = button.dataset.estado;
                const tipo = document.querySelector(".filtro.ativo").textContent.trim();
                exibirParlamentares(parlamentares, estado, tipo);
            });
        });
    }

    function exibirParlamentares(parlamentares, filtroEstado, filtroTipo) {
        console.log("Função exibirParlamentares chamada."); // Adiciona um log para verificar execução
        assinouContainer.innerHTML = "";
        naoAssinouContainer.innerHTML = "";
        outrosContainer.innerHTML = "";
    
        let contadorAssinou = 0;
        let contadorNaoAssinou = 0;
        let contadorOutros = 0;
    
        parlamentares.forEach(parlamentar => {
            // Verificação para excluir parlamentares com dados incompletos
            if (!parlamentar.Nome || !parlamentar.Estado || !parlamentar.Partido) {
                console.warn("Parlamentar com dados incompletos ignorado:", parlamentar);
                return; // Pula para o próximo parlamentar
            }
    
            console.log(`Adicionando parlamentar: ${parlamentar.Nome}`); // Log para cada parlamentar
    
            const parlamentarDiv = document.createElement("div");
            parlamentarDiv.classList.add("parlamentar");
    
            if (parlamentar["Nome da Foto ID"]) {
                const img = document.createElement("img");
                img.src = `imagens/${parlamentar["Nome da Foto ID"]}` || "placeholder.jpg";
                img.alt = parlamentar.Nome;
                parlamentarDiv.appendChild(img);
            }
    
            const tooltipDiv = document.createElement("div");
            tooltipDiv.classList.add("tooltip");
            tooltipDiv.innerHTML = `${parlamentar.Nome}<br>${parlamentar.Estado} - ${parlamentar.Partido}`;
            parlamentarDiv.appendChild(tooltipDiv);
    
            const assinou = (parlamentar["Assinou?"] || "").trim().toLowerCase() === "sim";
            const estado = (parlamentar.Estado || "").trim().toUpperCase();
            const cargo = (parlamentar.Cargo || "").trim().toLowerCase();
            const tipoCargo = (filtroTipo || "").toLowerCase();
            const tipoValido = tipoCargo === "total legislativo" || (tipoCargo === "deputados" && cargo === "deputado") || (tipoCargo === "senadores" && cargo === "senador");
    
            if (tipoValido && (filtroEstado === "Brasil Todo" || filtroEstado === estado)) {
                if (assinou) {
                    assinouContainer.appendChild(parlamentarDiv);
                    contadorAssinou++;
                } else {
                    naoAssinouContainer.appendChild(parlamentarDiv);
                    contadorNaoAssinou++;
                }
            } else {
                parlamentarDiv.classList.add("apagado");
                outrosContainer.appendChild(parlamentarDiv);
                contadorOutros++;
            }
        });
    
        // Atualiza os contadores nos títulos
        document.getElementById('contador-assinou').textContent = `(${contadorAssinou})`;
        document.getElementById('contador-nao-assinou').textContent = `(${contadorNaoAssinou})`;
        document.getElementById('contador-outros').textContent = `(${contadorOutros})`;
    }        
});
