const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db"); // conexión PostgreSQL

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 obtener todos
app.get("/api/pokemon", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pokemon");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔍 buscar por nombre
app.get("/api/pokemon/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;

    const result = await pool.query(
      "SELECT * FROM pokemon WHERE LOWER(nombre) = LOWER($1)",
      [nombre]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ IMPORTANTE: usar el puerto de Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});