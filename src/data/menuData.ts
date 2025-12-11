import plovImg from "@/assets/plov.jpg";
import samsaImg from "@/assets/samsa.jpg";
import shashlikImg from "@/assets/shashlik.jpg";
import lagmanImg from "@/assets/lagman.jpg";
import mantiImg from "@/assets/manti.jpg";
import chorsuImg from "@/assets/chorsu.jpg";
import cocaColaImg from "@/assets/coca_cola.png";
import pepsiImg from "@/assets/pepsi.png";
import flashImg from "@/assets/flash.png";
import chortoqImg from "@/assets/chortoq.png";
import juiceImg from "@/assets/juice.png";
import waterImg from "@/assets/water.png";
import fantaImg from "@/assets/fanta.jpg"; // Keep fanta as fallback or specific fanta image if available

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  variants?: {
    name: string;
    price: number;
  }[];
}

export const menuItems: MenuItem[] = [
  // 1-taom (Qattiq ovqatlar)
  {
    id: 1,
    name: "Palov",
    description: "An'anaviy o'zbek palovi mol go'shti, sabzi va ziravorlar bilan",
    price: 45000,
    image: plovImg,
    category: "1-taom",
    variants: [
      { name: "0.7 porsiya", price: 35000 },
      { name: "1 porsiya", price: 45000 },
      { name: "1 kg", price: 200000 },
    ]
  },
  {
    id: 2,
    name: "Somsa",
    description: "Go'shtli pishirilgan xachir buxorcha samsa",
    price: 12000,
    image: samsaImg,
    category: "1-taom",
  },
  {
    id: 3,
    name: "Shashlik",
    description: "Ko'mirda pishirilgan mol go'shti shashlik",
    price: 35000,
    image: shashlikImg,
    category: "1-taom",
    variants: [
      { name: "1 dona", price: 35000 },
    ]
  },
  {
    id: 4,
    name: "Chorsu",
    description: "Lahm go`shdan iborat",
    price: 60000,
    image: chorsuImg,
    category: "1-taom",
  },
  {
    id: 6,
    name: "Manti",
    description: "Bug'da pishirilgan katta go'shtli chuchvara",
    price: 28000,
    image: mantiImg,
    category: "1-taom",
    variants: [
      { name: "1 porsiya (5 dona)", price: 28000 },
    ]
  },

  // 2-taom (Suyuq ovqatlar)
  {
    id: 5,
    name: "Lag'mon",
    description: "Qo'lda tayyorlangan uzun noodle sabzavotlar va go'sht bilan",
    price: 32000,
    image: lagmanImg,
    category: "2-taom",
    variants: [
      { name: "0.7 porsiya", price: 25000 },
      { name: "1 porsiya", price: 32000 },
    ]
  },

  // Ichimliklar
  {
    id: 101,
    name: "Coca-Cola",
    description: "Muzdek Coca-Cola",
    price: 8000,
    image: cocaColaImg,
    category: "Ichimliklar",
    variants: [
      { name: "0.5L", price: 8000 },
      { name: "1.5L", price: 18000 },
      { name: "2L", price: 22000 },
    ]
  },
  {
    id: 103,
    name: "Fanta",
    description: "Muzdek Fanta",
    price: 8000,
    image: fantaImg,
    category: "Ichimliklar",
    variants: [
      { name: "0.5L", price: 8000 },
      { name: "1.5L", price: 18000 },
      { name: "2L", price: 22000 },
    ]
  },
  {
    id: 105,
    name: "Pepsi",
    description: "Muzdek Pepsi",
    price: 8000,
    image: pepsiImg,
    category: "Ichimliklar",
    variants: [
      { name: "0.5L", price: 8000 },
      { name: "1.5L", price: 18000 },
      { name: "2L", price: 22000 },
    ]
  },
  {
    id: 107,
    name: "Flash",
    description: "Quvvat beruvchi ichimlik",
    price: 12000,
    image: flashImg,
    category: "Ichimliklar",
    variants: [
      { name: "0.5L", price: 12000 },
    ]
  },
  {
    id: 108,
    name: "Chortoq",
    description: "Ma'danli suv",
    price: 5000,
    image: chortoqImg,
    category: "Ichimliklar",
    variants: [
      { name: "0.5L", price: 5000 },
    ]
  },
  {
    id: 109,
    name: "Sok",
    description: "Tabiiy meva sharbatlari",
    price: 15000,
    image: juiceImg,
    category: "Ichimliklar",
    variants: [
      { name: "Shaftoli 1L", price: 15000 },
      { name: "Olma 1L", price: 15000 },
      { name: "Apelsin 1L", price: 15000 },
      { name: "Olcha 1L", price: 15000 },
    ]
  },
  {
    id: 113,
    name: "Suv",
    description: "Toza ichimlik suvi",
    price: 3000,
    image: waterImg,
    category: "Ichimliklar",
    variants: [
      { name: "Gazsiz 0.5L", price: 3000 },
      { name: "Gazsiz 1.5L", price: 6000 },
      { name: "Gazli 0.5L", price: 3000 },
      { name: "Gazli 1.5L", price: 6000 },
    ]
  },
];

export const categories = ["1-taom", "2-taom", "Ichimliklar"];
