// COLE AQUI A URL QUE O GOOGLE APP SCRIPT GEROU
const URL_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbz8Z-ASkhlNNwIkUFkclCFqHfBMZRWSsXlHUbkCitN3IiqW5iSGvA-oFYBxtFspBUqt/exec";
document.addEventListener("DOMContentLoaded", () => {
  // Gerenciamento de Cenas (Slides)
  let cenaAtual = 0;
  const totalCenas = 6;

  function mostrarCena(index) {
    // Esconde todas as cenas
    document.querySelectorAll(".cena").forEach((cena) => {
      cena.classList.remove("ativa", "mostrar-texto");
      cena.classList.add("oculta");

      // Pausa o vídeo automaticamente se sair da tela dele
      const video = cena.querySelector("video");
      if (video) video.pause();
    });

    // Mostra a cena correta
    const cenaAtiva = document.getElementById(`cena-${index}`);
    if (cenaAtiva) {
      cenaAtiva.classList.remove("oculta");
      // Pequeno delay para a transição do CSS funcionar
      setTimeout(() => {
        cenaAtiva.classList.add("ativa");
      }, 50);

      // NOVO: Dá play automático no vídeo assim que a tela abre
      const video = cenaAtiva.querySelector("video");
      if (video) {
        video.currentTime = 0;
        video
          .play()
          .catch((e) => console.log("Autoplay bloqueado pelo navegador", e));
      }

      // A mágica dos 2 segundos para o texto aparecer
      if (index >= 1 && index <= 5) {
        setTimeout(() => {
          cenaAtiva.classList.add("mostrar-texto");
        }, 4000);
      }
    }
  }

  // Botões de "Continuar"
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
    // Envia email invisível
    fetch(URL_WEBHOOK, {
      method: "POST",
      body: JSON.stringify({ acao: "iniciar" }),
    }).catch(console.error);

    cena0.classList.remove("ativa");

    setTimeout(() => {
      cena0.classList.add("oculta");
      cenaCoracao.classList.remove("oculta");

      setTimeout(() => {
        cenaCoracao.classList.add("animar");
      }, 50);

      // Depois que o coração estoura, vai para a Cena 1
      setTimeout(() => {
        cenaCoracao.classList.remove("animar");
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
