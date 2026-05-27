require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
// ... (o resto do seu código a partir do app.use continua igualzinho)

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Configuração para receber o arquivo na memória
const upload = multer({ storage: multer.memoryStorage() });

// Configuração do seu e-mail (usará variáveis de ambiente no Render)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const destinatario = "rafaelbueno438@gmail.com";

// Rota 1: Botão Iniciar
app.post("/api/iniciar", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: "A página de recordação foi acessada",
      text: 'O botão "Iniciar" foi clicado e a página foi aberta agora.',
    });
    res.status(200).send({ message: "Notificação enviada" });
  } catch (error) {
    console.error("Erro ao enviar email de início:", error);
    res.status(500).send({ error: "Erro ao notificar" });
  }
});

// Rota 2: Envio de mensagem e arquivo final
app.post("/api/enviar-mensagem", upload.single("arquivo"), async (req, res) => {
  const { mensagem } = req.body;
  const arquivo = req.file;

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: "Nova mensagem da página de recordação",
    text: `Você recebeu uma nova mensagem:\n\n${mensagem}`,
  };

  if (arquivo) {
    mailOptions.attachments = [
      {
        filename: arquivo.originalname,
        content: arquivo.buffer,
      },
    ];
  }

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar mensagem com arquivo:", error);
    res.status(500).send({ error: "Erro ao enviar mensagem" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
