// COLE AQUI A URL QUE O GOOGLE APP SCRIPT GEROU
const URL_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbz8Z-ASkhlNNwIkUFkclCFqHfBMZRWSsXlHUbkCitN3IiqW5iSGvA-oFYBxtFspBUqt/exec";

document.addEventListener("DOMContentLoaded", () => {
  const btnIniciar = document.getElementById("btn-iniciar");
  const telaInicial = document.getElementById("tela-inicial");
  const telaGaleria = document.getElementById("tela-galeria");
  const inputArquivo = document.getElementById("arquivo");
  const nomeArquivo = document.getElementById("nome-arquivo");
  const formFinal = document.getElementById("form-final");
  const statusEnvio = document.getElementById("status-envio");

  // Botão Iniciar e transição
  btnIniciar.addEventListener("click", () => {
    fetch(URL_WEBHOOK, {
      method: "POST",
      body: JSON.stringify({ acao: "iniciar" }),
    }).catch(console.error);

    telaInicial.style.opacity = "0";
    setTimeout(() => {
      telaInicial.classList.remove("ativa");
      telaInicial.classList.add("oculta");

      telaGaleria.classList.remove("oculta");
      telaGaleria.classList.add("ativa");
      setTimeout(() => (telaGaleria.style.opacity = "1"), 50);
    }, 1000);
  });

  inputArquivo.addEventListener("change", function () {
    if (this.files && this.files.length > 0) {
      nomeArquivo.textContent = this.files[0].name;
    } else {
      nomeArquivo.textContent = "Nenhum arquivo escolhido";
    }
  });

  // Envio Final (convertendo arquivo para Base64)
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
        .then((response) => {
          statusEnvio.textContent = "Mensagem enviada com sucesso.";
          statusEnvio.style.color = "#4CAF50";
          formFinal.reset();
          nomeArquivo.textContent = "Nenhum arquivo escolhido";
          btnEnviar.textContent = "Enviar";
          btnEnviar.disabled = false;
        })
        .catch((error) => {
          statusEnvio.textContent = "Erro ao enviar. Tente novamente.";
          statusEnvio.style.color = "#f44336";
          btnEnviar.textContent = "Enviar";
          btnEnviar.disabled = false;
        });
    };

    // Se houver arquivo, lê como Base64 antes de enviar
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
