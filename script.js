// COLE AQUI A URL QUE O GOOGLE APP SCRIPT GEROU
const URL_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbz8Z-ASkhlNNwIkUFkclCFqHfBMZRWSsXlHUbkCitN3IiqW5iSGvA-oFYBxtFspBUqt/exec";

document.addEventListener("DOMContentLoaded", () => {
  const btnIniciar = document.getElementById("btn-iniciar");
  const telaInicial = document.getElementById("tela-inicial");
  const telaTransicao = document.getElementById("tela-transicao");
  const telaGaleria = document.getElementById("tela-galeria");

  // Controle de Animação de Rolagem (Scroll)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visivel");
        }
      });
    },
    { threshold: 0.2 },
  ); // Dispara quando 20% do bloco aparece na tela

  // Lógica do botão INICIAR
  btnIniciar.addEventListener("click", () => {
    // Envia email de notificação em silêncio
    fetch(URL_WEBHOOK, {
      method: "POST",
      body: JSON.stringify({ acao: "iniciar" }),
    }).catch(console.error);

    // Oculta tela inicial suavemente
    telaInicial.style.opacity = "0";

    setTimeout(() => {
      telaInicial.classList.add("oculta");
      telaTransicao.classList.remove("oculta"); // Mostra o coração

      // Aguarda a animação do coração terminar (2 segundos)
      setTimeout(() => {
        telaTransicao.classList.add("oculta");
        telaGaleria.classList.remove("oculta"); // Mostra a galeria
        window.scrollTo(0, 0); // Garante que começa no topo

        // Começa a observar os blocos para animação de rolagem
        document.querySelectorAll(".animar-scroll").forEach((bloco) => {
          observer.observe(bloco);
        });
      }, 2000);
    }, 800);
  });

  // Lógica do Formulário Final (mantida igual)
  const inputArquivo = document.getElementById("arquivo");
  const nomeArquivo = document.getElementById("nome-arquivo");
  const formFinal = document.getElementById("form-final");
  const statusEnvio = document.getElementById("status-envio");

  inputArquivo.addEventListener("change", function () {
    if (this.files && this.files.length > 0) {
      nomeArquivo.textContent = this.files[0].name;
    } else {
      nomeArquivo.textContent = "Nenhum arquivo escolhido";
    }
  });

  formFinal.addEventListener("submit", (e) => {
    e.preventDefault();

    const mensagem = document.getElementById("mensagem").value;
    const arquivo = inputArquivo.files[0];
    const btnEnviar = document.getElementById("btn-enviar");

    btnEnviar.textContent = "Enviando...";
    btnEnviar.disabled = true;

    const enviarParaGoogle = (base64Data, mimeType, fileName) => {
      fetch(URL_WEBHOOK, {
        method: "POST",
        body: JSON.stringify({
          acao: "mensagem",
          mensagem: mensagem,
          fileData: base64Data,
          mimeType: mimeType,
          fileName: fileName,
        }),
      })
        .then(() => {
          statusEnvio.textContent = "Mensagem enviada com sucesso.";
          statusEnvio.style.color = "#87CEFA";
          formFinal.reset();
          nomeArquivo.textContent = "Nenhum arquivo escolhido";
          btnEnviar.textContent = "Enviar";
          btnEnviar.disabled = false;
        })
        .catch(() => {
          statusEnvio.textContent = "Erro ao enviar. Tente novamente.";
          statusEnvio.style.color = "#f44336";
          btnEnviar.textContent = "Enviar";
          btnEnviar.disabled = false;
        });
    };

    if (arquivo) {
      const reader = new FileReader();
      reader.onload = (evento) => {
        const base64 = evento.target.result.split(",")[1];
        enviarParaGoogle(base64, arquivo.type, arquivo.name);
      };
      reader.readAsDataURL(arquivo);
    } else {
      enviarParaGoogle(null, null, null);
    }
  });
});
