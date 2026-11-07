import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config({path: '.env.prod'});

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Conectado a la base de datos");

    const products = [{
      _id: "68e535d21a44a3f109781d29",
      productId: "68e535d21a44a3f109781d29",
      name: {
        en: "Fruit Cider Variety Pack | 6 x 330ml (3 flavors)",
        es: "Pack Variado de Sidra de Fruta | 6 x 330ml (3 sabores)",
        ca: "Pack Variat de Cervesa de Fruita | 6 x 330ml (3 sabors)",
      },
      description: {
        en: `Introducing our Fruit Cider Variety Pack, a premium selection of six refreshing ciders crafted to delight your taste buds. This pack includes three distinct flavors: Green Pear, Sweet Apple, and Exotic Mix, each meticulously brewed to offer a unique and invigorating experience.

Our ciders are proudly produced locally, ensuring that every sip supports local craftsmanship and reduces our carbon footprint. Made from the finest quality ingredients, our ciders are vegan-friendly. We believe in creating products that are not only delicious but also align with a sustainable lifestyle.`,
        es: `Presentamos nuestro Pack Variado de Sidra de Fruta, una selección premium de seis sidras refrescantes elaboradas para deleitar tu paladar. Este pack incluye tres sabores distintos: Pera Verde, Manzana Dulce y Mezcla Exótica, cada uno meticulosamente elaborado para ofrecer una experiencia única y estimulante.

Nuestras sidras se producen orgullosamente de manera local, garantizando que cada sorbo apoye la artesanía local y reduzca nuestra huella de carbono. Elaboradas con ingredientes de la más alta calidad, nuestras sidras son aptas para veganos. Creemos en crear productos que no solo sean deliciosos, sino que también estén alineados con un estilo de vida sostenible.`,
        ca: `Presentem el nostre Pack Variat de Cervesa de Fruita, una selecció premium de sis cerveses refrescants elaborades per delectar les teves papil·les gustatives. Aquest pack inclou tres sabors diferents: Peres Verdes, Poma Dolça i Mescla Exòtica, cadascun elaborat amb cura per oferir una experiència única i estimulant.

Les nostres cerveses es produeixen amb orgull localment, assegurant que cada glop doni suport a l’artesania local i redueixi la nostra empremta de carboni. Fetes amb ingredients de la millor qualitat, les nostres cerveses són aptes per a vegans. Creiem en crear productes que no només siguin deliciosos, sinó que també estiguin alineats amb un estil de vida sostenible.`,
      },
      price: 10,
      media: [
        "/img/products/packs/varied-pack.png",
        "/img/products/cans/pear-can.png",
        "/img/products/cans/apple-can.png",
        "/img/products/cans/exotic-can.png",
      ],
      category: "Cider",
    },
    {
      _id: "68e535d21a44a3f109781d30",
      productId: "68e535d21a44a3f109781d30",
      name: {
        en: "Pear Cider Pack | 6 x 330ml",
        es: "Pack Sidra de Pera | 6 x 330ml",
        ca: "Pack Sidra de Pera | 6 x 330ml",
      },
      description: {
        en: "Six 330ml cans of our Green Pear cider. Crisp, fresh and naturally fruity, made locally with quality ingredients and suitable for vegans.",
        es: "Seis latas de 330ml de nuestra sidra de Pera Verde. Fresca, refrescante y de sabor natural a fruta, elaborada localmente con ingredientes de calidad y apta para veganos.",
        ca: "Sis llaunes de 330ml de la nostra sidra de Pera Verda. Fresca, refrescant i de sabor natural a fruita, elaborada localment amb ingredients de qualitat i apta per a vegans.",
      },
      price: 10,
      media: [
        "/img/products/packs/pear-pack.png",
        "/img/products/cans/pear-can.png",
      ],
      category: "Cider",
    },
    {
      _id: "68e535d21a44a3f109781d31",
      productId: "68e535d21a44a3f109781d31",
      name: {
        en: "Apple Cider Pack | 6 x 330ml",
        es: "Pack Sidra de Manzana | 6 x 330ml",
        ca: "Pack Sidra de Poma | 6 x 330ml",
      },
      description: {
        en: "Six 330ml cans of our Sweet Apple cider. A smooth, balanced flavour with a clean finish, made locally with quality ingredients and suitable for vegans.",
        es: "Seis latas de 330ml de nuestra sidra de Manzana Dulce. Sabor suave y equilibrado con un final limpio, elaborada localmente con ingredientes de calidad y apta para veganos.",
        ca: "Sis llaunes de 330ml de la nostra sidra de Poma Dolça. Sabor suau i equilibrat amb un final net, elaborada localment amb ingredients de qualitat i apta per a vegans.",
      },
      price: 10,
      media: [
        "/img/products/packs/apple-pack.png",
        "/img/products/cans/apple-can.png",
      ],
      category: "Cider",
    },
    {
      _id: "68e535d21a44a3f109781d32",
      productId: "68e535d21a44a3f109781d32",
      name: {
        en: "Exotic Cider Pack | 6 x 330ml",
        es: "Pack Sidra Exotic | 6 x 330ml",
        ca: "Pack Sidra Exòtica | 6 x 330ml",
      },
      description: {
        en: "Six 330ml cans of our Exotic Mix cider. A bold, tropical blend of fruit flavours, made locally with quality ingredients and suitable for vegans.",
        es: "Seis latas de 330ml de nuestra sidra de Mezcla Exótica. Una combinación audaz y tropical de sabores a fruta, elaborada localmente con ingredientes de calidad y apta para veganos.",
        ca: "Sis llaunes de 330ml de la nostra sidra de Mescla Exòtica. Una combinació atrevida i tropical de sabors a fruita, elaborada localment amb ingredients de qualitat i apta per a vegans.",
      },
      price: 10,
      media: [
        "/img/products/packs/exotic-pack.png",
        "/img/products/cans/exotic-can.png",
      ],
      category: "Cider",
    },
    {
      _id: "68e535d21a44a3f109781d33",
      productId: "68e535d21a44a3f109781d33",
      name: {
        en: "Pear Tote Bag",
        es: "Bolsa Tote de Pera",
        ca: "Bossa Tote de Pera",
      },
      description: {
        en: "Reusable tote bag with our Green Pear design.",
        es: "Bolsa tote reutilizable con el diseño de nuestra Pera Verde.",
        ca: "Bossa tote reutilitzable amb el disseny de la nostra Pera Verda.",
      },
      price: 3,
      media: [
        "/img/products/tote-bags/pear-totebag-photo.png",
        "/img/products/tote-bags/pear-tote-bag.png",
      ],
      category: "Tote Bags",
    },
    {
      _id: "68e535d21a44a3f109781d34",
      productId: "68e535d21a44a3f109781d34",
      name: {
        en: "Apple Tote Bag",
        es: "Bolsa Tote de Manzana",
        ca: "Bossa Tote de Poma",
      },
      description: {
        en: "Reusable tote bag with our Sweet Apple design.",
        es: "Bolsa tote reutilizable con el diseño de nuestra Manzana Dulce.",
        ca: "Bossa tote reutilitzable amb el disseny de la nostra Poma Dolça.",
      },
      price: 3,
      media: [
        "/img/products/tote-bags/apple-totebag-photo.png",
        "/img/products/tote-bags/apple-tote-bag.png",
      ],
      category: "Tote Bags",
    },
    {
      _id: "68e535d21a44a3f109781d35",
      productId: "68e535d21a44a3f109781d35",
      name: {
        en: "Exotic Tote Bag",
        es: "Bolsa Tote Exotic",
        ca: "Bossa Tote Exòtica",
      },
      description: {
        en: "Reusable tote bag with our Exotic Mix design.",
        es: "Bolsa tote reutilizable con el diseño de nuestra Mezcla Exótica.",
        ca: "Bossa tote reutilitzable amb el disseny de la nostra Mescla Exòtica.",
      },
      price: 3,
      media: [
        "/img/products/tote-bags/exotic-totebag-photo.png",
        "/img/products/tote-bags/exotic-tote-bag.png",
      ],
      category: "Tote Bags",
    }];

    for (const { _id, ...data } of products) {
      await Product.updateOne({ _id }, { $set: data }, { upsert: true });
    }
    console.log("✅ Productos creados o actualizados con éxito");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error:", err);
    mongoose.connection.close();
  }
};

seed();
