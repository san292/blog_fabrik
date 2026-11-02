import type { APIRoute } from "astro";
import { config } from "../lib/site.ts";

/** Fichier de vérification IndexNow : /<clé>.txt contient la clé. */
export const GET: APIRoute = () =>
  new Response(config.indexNowKey ?? "", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
