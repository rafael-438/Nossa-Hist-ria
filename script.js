// COLE AQUI A URL QUE O GOOGLE APP SCRIPT GEROU
const URL_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbz8Z-ASkhlNNwIkUFkclCFqHfBMZRWSsXlHUbkCitN3IiqW5iSGvA-oFYBxtFspBUqt/exec";
document.addEventListener("DOMContentLoaded", () => {
  const btnIniciar = document.getElementById("btn-iniciar");
  const telaInicial = document.getElementById("tela-inicial");
  const telaTransicao = document.getElementById("tela-transicao");
  const telaGaleria = document.getElementById("tela-galeria");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visivel");
        }
      });
    },
    { threshold: 0.2 },
  );

  btnIniciar.addEventListener("click", () => {
    fetch(URL_WEBHOOK, {
      method: "POST",
      body: JSON.stringify({ acao: "iniciar" }),
    }).catch(console.error);

    telaInicial.style.opacity = "0";

    setTimeout(() => {
      telaInicial.classList.add("oculta");
      telaTransicao.classList.remove("oculta");

      // Força um pequeno atraso e dispara a animação do coração
      setTimeout(() => {
        telaTransicao.classList.add("animar");
      }, 50);

      // Aguarda 3 segundos (tempo do coração crescer) e mostra as fotos
      setTimeout(() => {
        telaTransicao.classList.add("oculta");
        telaGaleria.classList.remove("oculta");
        window.scrollTo(0, 0);

        document.querySelectorAll(".animar-scroll").forEach((bloco) => {
          observer.observe(bloco);
        });
      }, 3000);
    }, 800);
  });

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
