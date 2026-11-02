declare module "virtual:blog-core/config" {
  import type { SiteConfig } from "@blog-factory/core/config";

  const config: SiteConfig;
  export default config;
  /** Chemins absolus des fichiers utilisés pour générer les images Open Graph. */
  export const ogAssets: {
    readonly display: string;
    readonly body: string;
    readonly resvgWasm: string;
  };
}
