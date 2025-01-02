import axios from "axios";
import * as cheerio from "cheerio";

interface Resultados {
  megasena: string[];
  lotofacil: string[];
  quina: string[];
  lotomania: string[];
  timemania: string[];
  duplasena: string[];
  milionaria: string[];
}

export async function obterResultados(): Promise<Resultados | null> {
  try {
    const response = await axios.get(
      "http://loterias.caixa.gov.br/wps/portal/loterias/landing"
    );
    const html = response.data;
    const $ = cheerio.load(html);

    const resultados: Resultados = {
      megasena: extrairNumeros($, "MEGA-SENA"),
      lotofacil: extrairNumeros($, "LOTOFÁCIL"),
      quina: extrairNumeros($, "QUINA"),
      lotomania: extrairNumeros($, "LOTOMANIA"),
      timemania: extrairNumeros($, "TIMEMANIA"),
      duplasena: extrairNumeros($, "DUPLA-SENA"),
      milionaria: extrairNumeros($, "MILIONÁRIA"),
    };

    console.log("Resultados extraídos:", resultados);

    return resultados;
  } catch (error) {
    console.error("Erro ao obter resultados:", error);
    return null;
  }
}

function extrairNumeros($: cheerio.CheerioAPI, nomeLoteria: string): string[] {
  const divSorteio = $(`div:contains(${nomeLoteria})`).next().text();
  const regex = /(\d{2})/g;
  const numeros = divSorteio.match(regex);
  console.log(`Números extraídos da ${nomeLoteria}:`, numeros);
  return numeros ? numeros : [];
}
