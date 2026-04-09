import images from "./images";
import video from "../assets/video1.mp4";

// Projects data for HeroParallax
const products = [
  {
    title: "",
    link: "",
    thumbnail: images.img4,
  },
  {
    title: "",
    link: "",
    thumbnail: images.project1,
  },
  {
    title: "",
    link: "",
    thumbnail: images.img3,
  },

  {
    title: "",
    link: "",
    thumbnail: images.img7,
  },
  {
    title: "",
    link: "",
    thumbnail: images.img6,
  },
  {
    title: "",
    link: "",
    thumbnail: images.project6,
  },

  {
    title: "",
    link: "",
    thumbnail: images.img8,
  },
  {
    title: "",
    link: "",
    thumbnail: images.img9,
  },
  {
    title: "",
    link: "",
    thumbnail: images.img5,
  },
  {
    title: "",
    link: "",
    thumbnail: images.project2,
  },
  {
    title: "",
    link: "",
    thumbnail: images.project3,
  },

  {
    title: "",
    link: "",
    thumbnail: images.img3,
  },
  {
    title: "",
    link: "",
    thumbnail: images.img6,
  },
  {
    title: "",
    link: "",
    thumbnail: images.project5,
  },
  {
    title: "",
    link: "",
    thumbnail: images.img4,
  },
];

// All projects
const allProjects = [
  {
    title: "Fournisseur de proximité",
    description:
      "Un service de livraison rapide et fiable pour répondre à tous vos besoins de proximité.",
    tags: ["React.js", "Framer-motion", "Node js", "MongoDB", "Express.js"],
    link: "https://fdp-app-client.vercel.app",
    imgSrc: images.project4,
    category: "App Web / E-commerce",
    year: "2025",
  },
  {
    title: "WanTech",
    description:
      " Agence de développement web et mobile spécialisée dans la création de solutions numériques innovantes et personnalisées pour les entreprises de toutes tailles.",
    link: "https://wantechpro.com",
    imgSrc: images.project13,
    category: "Site Web",
    year: "2025",
    tags: ["React.js", "Framer-motion", "Tailwind CSS", "GSAP", "Lenis"],
  },
  {
    title: "Gericht",
    description:
      "Restaurant en ligne offrant une expérience culinaire exceptionnelle avec une interface conviviale et des fonctionnalités innovantes.",
    link: "https://gericht-a.netlify.app",
    imgSrc: images.project5,
    category: "Site Web",
    year: "2025",
    tags: ["React.js", "Framer-motion"],
  },
  {
    title: "RapidPay",
    description:
      "Platforme de reservation de bus en ligne offrant une expérience de réservation rapide et facile pour les voyageurs.",
    link: "",
    imgSrc: images.project1,
    category: "Web3 / Fintech",
    year: "2025",
    tags: ["React Native", "Expo"],
  },
  {
    title: "Ona Batiment",
    description:
      "Agence de construction et de rénovation offrant des services de qualité pour tous vos projets de construction et de rénovation.",
    link: "https://onabatiment.com",
    category: "Site Web",
    year: "2025",
    tags: ["React.js", "Framer-motion", "Tailwind CSS"],

    imgSrc:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
  },
  // {
  //   title: "General TTK",
  //   description: "",
  //   link: "https://gttk.netlify.app/",
  //   imgSrc: images.project6,
  //   category: "Web3 / Fintech",
  //   year: "2025",
  // },

  {
    title: "Smart Electric Meter",
    description:
      "App mobile de gestion de compteurs électriques intelligents, offrant une interface conviviale pour surveiller la consommation d'énergie, payer les factures et recevoir des notifications en temps réel.",
    link: "",
    tags: ["React Native", "Expo"],

    imgSrc: images.limba,
    category: "App Mobile",
    year: "2025",
  },
  {
    title: "AESG Chine",
    description:
      "Site de l'Association des Etudiants Gabonais de Chine, offrant des informations sur les activités, les événements et les ressources pour les étudiants gabonais en Chine.",
    link: "https://gabonaisdechine.com",
    imgSrc: images.img1,
    category: "App Web",
    year: "2025",
    tags: ["React.js", "GSAP", "PostgreSQL", "Node.js"],
  },
];
// Services items
const servicesItems = [
  {
    id: 1,
    title: "SITES WEB",
    description:
      "Nous concevons des sites web sur mesure qui reflètent l'identité de votre marque et répondent à vos objectifs commerciaux. Que vous ayez besoin d'un site vitrine, d'une plateforme e-commerce ou d'un blog,",
    img: images.webSite,
  },
  {
    id: 2,
    title: "APPLICATIONS MOBILE",
    description:
      "Nous concevons des applications mobiles innovantes, parfaitement adaptées aux besoins uniques de votre entreprise et de vos utilisateurs. Nous créons des applications intuitives, performantes et visuellement attrayantes, qu'elles soient destinées à iOS, Android ou aux deux",
    img: images.mobileApp,
  },
  {
    id: 3,
    title: "LOGO ET AFFICHES",
    description:
      "Votre image de marque commence par un logo percutant et des affiches attrayantes. Nous travaillons en étroite collaboration avec vous pour comprendre vos valeurs et votre vision, afin de créer des éléments graphiques qui captivent votre audience.",
    img: images.logoIntro,
  },
  {
    id: 4,
    title: "Video Marketing",
    description:
      "Nous donnons vie à votre message grâce à des vidéos captivantes et stratégiquement pensées. Qu’il s’agisse de présentations de produits, de contenus pour les réseaux sociaux ou de publicités percutantes, nous créons des vidéos qui retiennent l’attention, engagent votre audience et renforcent votre image de marque",
    video: video,
  },
];
//  Logo data
const logoData = [
  {
    title: "",
    logo: images.logo2,
  },
  {
    title: "",
    logo: images.logo3,
  },
  // {
  //   title: "",
  //   logo: images.logo1,
  // },
  {
    title: "",
    logo: images.logo8,
  },
  {
    title: "",
    logo: images.logo6,
  },
  {
    title: "",
    logo: images.logo5,
  },
  {
    title: "",
    logo: images.logo7,
  },
  {
    title: "",
    logo: images.logo9,
  },
  {
    title: "",
    logo: images.logo10,
  },
];

export { products, servicesItems, allProjects, logoData };
