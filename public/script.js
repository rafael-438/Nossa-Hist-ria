document.addEventListener('DOMContentLoaded', () => {
    const btnIniciar = document.getElementById('btn-iniciar');
    const telaInicial = document.getElementById('tela-inicial');
    const telaGaleria = document.getElementById('tela-galeria');
    const inputArquivo = document.getElementById('arquivo');
    const nomeArquivo = document.getElementById('nome-arquivo');
    const formFinal = document.getElementById('form-final');
    const statusEnvio = document.getElementById('status-envio');

    // Transição de tela e aviso por email
    btnIniciar.addEventListener('click', async () => {
        // Envia notificação para o backend em silêncio
        fetch('/api/iniciar', { method: 'POST' }).catch(console.error);

        // Animação de transição
        telaInicial.style.opacity = '0';
        setTimeout(() => {
            telaInicial.classList.remove('ativa');
            telaInicial.classList.add('oculta');
            
            telaGaleria.classList.remove('oculta');
            telaGaleria.classList.add('ativa');
            setTimeout(() => telaGaleria.style.opacity = '1', 50);
        }, 1000);
    });

    // Atualiza o nome do arquivo escolhido
    inputArquivo.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            nomeArquivo.textContent = this.files[0].name;
        } else {
            nomeArquivo.textContent = 'Nenhum arquivo escolhido';
        }
    });

    // Envio do formulário final
    formFinal.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const mensagem = document.getElementById('mensagem').value;
        const arquivo = inputArquivo.files[0];
        const btnEnviar = document.getElementById('btn-enviar');

        const formData = new FormData();
        formData.append('mensagem', mensagem);
        if (arquivo) {
            formData.append('arquivo', arquivo);
        }

        btnEnviar.textContent = 'Enviando...';
        btnEnviar.disabled = true;

        try {
            const response = await fetch('/api/enviar-mensagem', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                statusEnvio.textContent = 'Mensagem enviada com sucesso.';
                statusEnvio.style.color = '#4CAF50';
                formFinal.reset();
                nomeArquivo.textContent = 'Nenhum arquivo escolhido';
            } else {
                throw new Error('Falha no envio');
            }
        } catch (error) {
            statusEnvio.textContent = 'Ocorreu um erro ao enviar. Tente novamente.';
            statusEnvio.style.color = '#f44336';
        } finally {
            btnEnviar.textContent = 'Enviar';
            btnEnviar.disabled = false;
        }
    });
});
