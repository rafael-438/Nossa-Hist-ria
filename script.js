// COLE AQUI A URL QUE O GOOGLE APP SCRIPT GEROU
const URL_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbz8Z-ASkhlNNwIkUFkclCFqHfBMZRWSsXlHUbkCitN3IiqW5iSGvA-oFYBxtFspBUqt/exec";

document.addEventListener("DOMContentLoaded", () => {
  // Gerenciamento de Cenas (Slides)
  let cenaAtual = 0;

  function mostrarCena(index) {
    document.querySelectorAll(".cena").forEach((cena) => {
      cena.classList.remove("ativa", "mostrar-texto");
      cena.classList.add("oculta");

      const video = cena.querySelector("video");
      if (video) video.pause();
    });

    const cenaAtiva = document.getElementById(`cena-${index}`);
    if (cenaAtiva) {
      cenaAtiva.classList.remove("oculta");
      setTimeout(() => {
        cenaAtiva.classList.add("ativa");
      }, 50);

      const video = cenaAtiva.querySelector("video");
      if (video) {
        video.currentTime = 0;
        video
          .play()
          .catch((e) => console.log("Autoplay bloqueado pelo navegador", e));
      }

      // LÓGICA INTELIGENTE DE TEMPO DAS FRASES
      if (index >= 1 && index <= 5) {
        let tempoDeEspera = 2000; // Padrão

        if (index === 1 || index === 3) {
          // Cena 1 (Uma foto) e Cena 3 (Vídeo): 3 segundos
          tempoDeEspera = 3000;
        } else if (index === 2 || index === 4) {
          // Cena 2 e 4 (2 a 4 fotos): 4 segundos
          tempoDeEspera = 4000;
        } else if (index === 5) {
          // Cena 5 (Mosaico de 16 fotos): 5 segundos
          tempoDeEspera = 5000;
        }

        setTimeout(() => {
          cenaAtiva.classList.add("mostrar-texto");
        }, tempoDeEspera);
      }
    }
  }

  document.querySelectorAll(".btn-proximo").forEach((btn) => {
    btn.addEventListener("click", () => {
      cenaAtual++;
      mostrarCena(cenaAtual);
    });
  });

  // Início com a Animação do Coração
  const btnIniciar = document.getElementById("btn-iniciar");
  const cena0 = document.getElementById("cena-0");
  const cenaCoracao = document.getElementById("cena-coracao");

  btnIniciar.addEventListener("click", () => {
    fetch(URL_WEBHOOK, {
      method: "POST",
      body: JSON.stringify({ acao: "iniciar" }),
    }).catch(console.error);

    cena0.classList.remove("ativa");

    setTimeout(() => {
      cena0.classList.add("oculta");
      cenaCoracao.classList.remove("oculta");
      cenaCoracao.classList.add("ativa");

      setTimeout(() => {
        cenaCoracao.classList.add("animar");
      }, 50);

      setTimeout(() => {
        cenaCoracao.classList.remove("animar", "ativa");
        cenaCoracao.classList.add("oculta");
        cenaAtual = 1;
        mostrarCena(cenaAtual);
      }, 3000);
    }, 800);
  });

  // Formulário Final
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
