import app from "./app";
import pool from "./config/database";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);

  try {
    const connection = await pool.getConnection();
    console.log("Conectado ao banco de dados");
    connection.release();
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
});
