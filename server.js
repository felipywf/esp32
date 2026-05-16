const express = require("express");
const app = express();

app.use(express.json());

// Permite que o SMAX mande dados (CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Memória da A.R.I.A.
let ariaState = {
  resolvidos: 0,
  fila: 0,
  timestamp: Date.now()
};

// ROTA 1: O SMAX manda os dados pra cá
app.post("/update", (req, res) => {
  if (req.body.comando === "atualizar_painel") {
    ariaState.resolvidos = req.body.resolvidos;
    ariaState.fila = req.body.fila;
    ariaState.timestamp = Date.now();
    console.log("SMAX mandou novos dados. Resolvidos:", ariaState.resolvidos, "| Fila:", ariaState.fila);
    res.json({ status: "ok" });
  } else {
    res.status(400).json({ erro: "comando invalido" });
  }
});

// ROTA 2: A placa ESP32 busca os dados aqui
app.get("/state", (req, res) => {
  res.json(ariaState);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("A.R.I.A. rodando na porta " + PORT);
});
