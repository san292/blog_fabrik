import { defineSiteConfig } from "@blog-factory/core/config";

export default defineSiteConfig({
  name: "IPTV Clair",
  tagline: "Le guide indépendant pour regarder la télé par Internet, légalement et sans galère.",
  description:
    "IPTV Clair explique la télé par Internet : fonctionnement, offres légales, appareils, qualité d'image et risques de l'IPTV pirate en France.",
  url: "https://iptv-clair.fr",
  lang: "fr",
  locale: "fr_FR",
  logoMark: "TV",
  publisher: { name: "IPTV Clair" },
  authors: [
    {
      // À remplacer par une vraie personne (nom, expérience, profils) : c'est un signal E-E-A-T fort.
      slug: "redaction",
      name: "Rédaction IPTV Clair",
      role: "Équipe éditoriale",
      bio: "La rédaction d'IPTV Clair teste les offres et les appareils de télévision par Internet, et s'appuie sur les publications de l'Arcom et de la presse spécialisée.",
      sameAs: [],
    },
  ],
  categories: [
    {
      slug: "comprendre",
      label: "Comprendre l'IPTV",
      description:
        "Ce qu'est l'IPTV, comment la télévision passe par Internet et ce qui la distingue de la TNT, du satellite et du streaming.",
    },
    {
      slug: "equipement",
      label: "Équipement",
      description:
        "Smart TV, boîtiers Android TV, Apple TV, Fire TV ou box opérateur : quel appareil choisir pour regarder la télé par Internet.",
    },
    {
      slug: "installation",
      label: "Installation",
      description:
        "Brancher et configurer sa télévision par Internet : box opérateur, boîtier, application, débit et Wi-Fi pour une image stable.",
    },
    {
      slug: "depannage",
      label: "Dépannage",
      description:
        "Image qui gèle, son décalé, chaîne qui ne charge pas : repérer la panne et la corriger, du décodeur jusqu'à la box.",
    },
    {
      slug: "offres-legales",
      label: "Offres légales",
      description:
        "Box des opérateurs, applications gratuites des chaînes, Molotov et services payants : toutes les façons légales de regarder la télé.",
    },
    {
      slug: "legalite",
      label: "Légalité et risques",
      description:
        "IPTV pirate : ce que dit la loi en France, les sanctions déjà prononcées, les blocages de l'Arcom et les risques pour vos données.",
    },
  ],
  nav: [
    { label: "Accueil", href: "/" },
    { label: "Installation", href: "/categorie/installation/" },
    { label: "Contact", href: "/contact/" },
    { label: "À propos", href: "/a-propos/" },
  ],
  theme: {
    accent: "#0e7c66",
    accentDark: "#3ccfa9",
    fonts: {
      display: "bricolage-grotesque",
      body: "figtree",
      reading: "source-serif-4",
      mono: "jetbrains-mono",
    },
  },
  layout: { postList: "grid-2", sidebar: "right", header: "left", featuredPost: true },
  postsPerPage: 9,
});
