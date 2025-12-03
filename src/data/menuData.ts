import plovImg from "@/assets/plov.jpg";
import samsaImg from "@/assets/samsa.jpg";
import shashlikImg from "@/assets/shashlik.jpg";
import lagmanImg from "@/assets/lagman.jpg";
import mantiImg from "@/assets/manti.jpg";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Palov",
    description: "An'anaviy o'zbek palovi mol go'shti, sabzi va ziravorlar bilan",
    price: 45000,
    image: plovImg,
    category: "Asosiy taomlar",
  },
  {
    id: 2,
    name: "Samsa",
    description: "Go'shtli pishirilgan xachir buxorcha samsa",
    price: 12000,
    image: samsaImg,
    category: "Pishiriqlar",
  },
  {
    id: 3,
    name: "Shashlik",
    description: "Ko'mirda pishirilgan mol go'shti shashlik",
    price: 35000,
    image: shashlikImg,
    category: "Kaboblar",
  },
  {
    id: 4,
    name: "Lag'mon",
    description: "Qo'lda tayyorlangan uzun noodle sabzavotlar va go'sht bilan",
    price: 32000,
    image: lagmanImg,
    category: "Sho'rvalar",
  },
  {
    id: 5,
    name: "Manti",
    description: "Bug'da pishirilgan katta go'shtli chuchvara",
    price: 28000,
    image: mantiImg,
    category: "Asosiy taomlar",
  },
];

export const categories = ["Hammasi", "Asosiy taomlar", "Pishiriqlar", "Kaboblar", "Sho'rvalar"];
