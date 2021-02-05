const express = require("express");
const formidable = require("express-formidable");
require("dotenv").config();
const cors = require("cors");

// initialisation du serveur
const app = express();
app.use(formidable());
app.use(cors());

const api_key = process.env.MAIL_GUN_API_KEY;
const domain = process.env.MAIL_GUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.post("/mail", (req, res) => {
  try {
    const { name, firstName, email, phone, message } = req.fields;

    const data = {
      from: `Portfolio <postmaster@${domain}>`,
      to: process.env.MAIL_ADDRESS,
      subject: `Contact via portfolio de la part de ${firstName} ${name}, ${email}, ${phone}`,
      text: message,
    };
    console.log(data);
    mailgun.messages().send(data, (error, body) => {
      if (!error) {
        return res.status(200).json(body);
      } else {
        res.status(401).json(error);
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
