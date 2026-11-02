import { readFile } from "node:fs/promises";
import { createElement as h } from "react";
import satori from "satori";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { ogAssets } from "virtual:blog-core/config";

export interface OgImageInput {
  readonly siteName: string;
  readonly logoMark: string;
  readonly title: string;
  readonly eyebrow: string;
  readonly accent: string;
  readonly footer: string;
}

const assets: { ready?: Promise<[Buffer, Buffer]> } = {};

/** Charge les polices et initialise resvg (WebAssembly) une seule fois par build. */
const loadAssets = (): Promise<[Buffer, Buffer]> => {
  assets.ready ??= Promise.all([
    readFile(ogAssets.display),
    readFile(ogAssets.body),
    readFile(ogAssets.resvgWasm).then((wasm) => initWasm(wasm)),
  ]).then(([display, body]) => [display, body]);
  return assets.ready;
};

/** Image Open Graph 1200×630 générée au build (aucun service externe). */
export const renderOgImage = async (input: OgImageInput): Promise<Buffer> => {
  const [display, body] = await loadAssets();
  const titleSize = input.title.length > 48 ? 60 : 72;

  const tree = h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "#101217",
        color: "#f3f4f7",
        fontFamily: "Body",
        borderTop: `14px solid ${input.accent}`,
      },
    },
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "18px", fontSize: 30 } },
      h(
        "div",
        {
          style: {
            width: 56,
            height: 56,
            borderRadius: 10,
            background: input.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: 24,
          },
        },
        input.logoMark,
      ),
      h("div", { style: { fontFamily: "Display", fontSize: 34 } }, input.siteName),
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "22px" } },
      h(
        "div",
        {
          style: {
            fontSize: 26,
            color: input.accent,
            textTransform: "uppercase",
            letterSpacing: 3,
          },
        },
        input.eyebrow,
      ),
      h(
        "div",
        {
          style: {
            fontFamily: "Display",
            fontSize: titleSize,
            lineHeight: 1.08,
            letterSpacing: -1.5,
          },
        },
        input.title,
      ),
    ),
    h("div", { style: { fontSize: 26, color: "#a1a8b4" } }, input.footer),
  );

  const svg = await satori(tree, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Display", data: display, weight: 700, style: "normal" },
      { name: "Body", data: body, weight: 500, style: "normal" },
    ],
  });
  return Buffer.from(new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng());
};
