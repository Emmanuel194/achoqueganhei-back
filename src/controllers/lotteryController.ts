import { Request, Response } from "express";
import { obterResultados } from "../service/loteriaService";

export const getResultados = async (req: Request, res: Response) => {
  const resultados = await obterResultados();
  if (resultados) {
    res.json(resultados);
  } else {
    res.status(500).send("Erro ao obter resultados");
  }
};
