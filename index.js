require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
app.use(formidable());
app.use(cors());

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Emmanuelle",
  key: process.env.MAILGUN_API_KEY,
});

app.get("/", (req, res) => {
  res.send("server is up");
});

app.post("/form", (req, res) => {
  //   Le console.log de req.fields nous affiche les données qui ont été rentrées dans les inputs (dans le formulaire frontend) :

  console.log(req.fields);

  //   On crée un objet messageData qui contient des informations concernant le mail (qui m'envoie le mail, adresse vers laquelle je veux envoyer le mail, titre et contenu du mail) :
  const messageData = {
    from: `${req.fields.firstname}  ${req.fields.lastname} <${req.fields.email}> `,
    to: "emmanuelledennemont@orange.fr",
    subject: `Formulaire JS`,
    text: req.fields.message,
  };

  //   Fonctions fournies par le package mailgun pour créer le mail et l'envoyer, en premier argument de `create`, votre nom de domaine :
  client.messages
    .create(
      process.env.MAILGUN_DOMAIN,
      messageData
    ) /* VOTRE NOM DE DOMAINE SE TERMINANT PAR `.mailgun.org` */
    .then((response) => {
      console.log(response);
      res.status(200).json({ message: "email sent" });
    })
    .catch((err) => {
      res.status(err.status).json({ message: err.message });
    });
});

app.all("*", (req, res) => {
    res.status(404).json("Route introuvable");
  });

app.listen(process.env.PORT, () => {
  console.log("Server has started !!");
});
