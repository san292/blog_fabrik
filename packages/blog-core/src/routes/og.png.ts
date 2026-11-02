import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { renderOgImage, type OgImageInput } from "../lib/og-image.ts";
import { getPosts } from "../lib/posts.ts";
import { formatDate } from "../lib/pure.ts";
import { config } from "../lib/site.ts";

const base = { siteName: config.name, logoMark: config.logoMark, accent: config.theme.accent };
const host = new URL(config.url).host;

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  const home: OgImageInput = {
    ...base,
    title: config.tagline,
    eyebrow: config.publisher.name,
    footer: host,
  };
  return [
    { params: { slug: "index" }, props: { image: home } },
    ...posts.map((post) => ({
      params: { slug: post.id },
      props: {
        image: {
          ...base,
          title: post.title,
          eyebrow: post.categoryInfo.label,
          footer: `${post.author.name} · ${formatDate(post.date, config.lang)} · ${host}`,
        } satisfies OgImageInput,
      },
    })),
  ];
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props }) => {
  const png = await renderOgImage(props.image);
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
