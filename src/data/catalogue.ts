export type Currency = "GBP" | "USD" | "EUR" | "CNY";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
GBP: "£", USD: "$", EUR: "€", CNY: "¥"
};

export const CURRENCY_FLAGS: Record<Currency, string> = {
GBP: "🇬🇧", USD: "🇺🇸", EUR: "🇪🇺", CNY: "🇨🇳"
};

export type Product = {
id: number;
name: string;
category: "Cotton" | "Linen" | "Silk" | "Synthetic" | "Blends" | "Finished";
origin: string;
gsm?: string;
width?: string;
minOrder: string;
priceGBP: { min: number; max: number; unit: string };
description: string;
tags: string[];
image: string;
featured?: boolean;
};

export function formatPrice(p: Product, currency: Currency, rates: Record<string, number>): string {
const rate = currency === "GBP" ? 1 : (rates[currency] || 1);
const min = (p.priceGBP.min * rate).toFixed(2);
const max = (p.priceGBP.max * rate).toFixed(2);
const sym = CURRENCY_SYMBOLS[currency];
return `${sym}${min}–${sym}${max}/${p.priceGBP.unit}`;
}

export const PRODUCTS: Product[] = [
{ id:1, name:"Heavyweight Organic Cotton Canvas", category:"Cotton", origin:"Turkey", gsm:"320gsm", width:"150cm", minOrder:"200m",
priceGBP:{min:3.20,max:4.10,unit:"m"},
description:"Dense, durable cotton canvas ideal for upholstery, bags, and workwear. GOTS certified organic.",
tags:["organic","durable","workwear","upholstery"],
image:"https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80", featured:true },
{ id:2, name:"Superfine Egyptian Cotton Poplin", category:"Cotton", origin:"Egypt", gsm:"110gsm", width:"145cm", minOrder:"150m",
priceGBP:{min:4.50,max:6.00,unit:"m"},
description:"Extra-long staple Egyptian cotton with a smooth, lustrous finish. Perfect for premium shirting.",
tags:["premium","shirting","luxury","long-staple"],
image:"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80", featured:true },
{ id:3, name:"Belgian Linen — Natural Undyed", category:"Linen", origin:"Belgium", gsm:"190gsm", width:"140cm", minOrder:"100m",
priceGBP:{min:5.80,max:7.50,unit:"m"},
description:"Classic wet-spun Belgian linen in natural ecru. Breathable, stonewashed for softness.",
tags:["natural","breathable","stonewashed","sustainable"],
image:"https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&w=600&q=80", featured:true },
{ id:4, name:"Dupioni Raw Silk", category:"Silk", origin:"India", gsm:"75gsm", width:"115cm", minOrder:"50m",
priceGBP:{min:12.00,max:16.00,unit:"m"},
description:"Traditional dupioni silk with characteristic slub texture. Lustrous sheen for occasion wear.",
tags:["luxury","occasion-wear","lustrous","slub"],
image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80" },
{ id:5, name:"East African Kitenge Print Cotton", category:"Cotton", origin:"East Africa", gsm:"160gsm", width:"114cm", minOrder:"200m",
priceGBP:{min:2.80,max:3.60,unit:"m"},
description:"Vibrant wax-resist printed cotton in traditional East African patterns. Iconic cultural textile.",
tags:["print","cultural","vibrant","wax-resist"],
image:"https://images.unsplash.com/photo-1550353185-761a5da3ee96?auto=format&fit=crop&w=600&q=80", featured:true },
{ id:6, name:"Recycled Polyester Jersey", category:"Synthetic", origin:"Portugal", gsm:"200gsm", width:"160cm", minOrder:"300m",
priceGBP:{min:2.10,max:2.90,unit:"m"},
description:"GRS-certified jersey knit from 100% post-consumer recycled PET. Excellent stretch and recovery.",
tags:["recycled","sustainable","stretch","GRS-certified"],
image:"https://images.unsplash.com/photo-1631089877353-a85e2e0d7c36?auto=format&fit=crop&w=600&q=80" },
{ id:7, name:"Cotton-Linen Chambray Blend", category:"Blends", origin:"Turkey", gsm:"145gsm", width:"145cm", minOrder:"150m",
priceGBP:{min:3.90,max:5.20,unit:"m"},
description:"55% cotton / 45% linen chambray with a casual, lived-in aesthetic. Ideal for summer garments.",
tags:["chambray","summer","casual","blend"],
image:"https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80" },
{ id:8, name:"Ready-Made Cotton Tote Bags", category:"Finished", origin:"Bangladesh",
minOrder:"500 units",
priceGBP:{min:0.85,max:1.20,unit:"unit"},
description:"Natural unbleached cotton tote bags, 10oz canvas. Available blank or with custom print.",
tags:["finished-goods","tote","custom-print","promotional"],
image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80" },
{ id:9, name:"Herringbone Wool Suiting", category:"Blends", origin:"Italy", gsm:"280gsm", width:"150cm", minOrder:"50m",
priceGBP:{min:18.00,max:26.00,unit:"m"},
description:"Premium Italian herringbone in wool-poly blend. Ideal for tailored suiting and structured outerwear.",
tags:["suiting","luxury","herringbone","Italian"],
image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80" },
{ id:10, name:"Bamboo-Cotton Jersey", category:"Blends", origin:"China", gsm:"175gsm", width:"155cm", minOrder:"200m",
priceGBP:{min:3.60,max:4.80,unit:"m"},
description:"60% bamboo / 40% organic cotton jersey. Incredibly soft, moisture-wicking, and sustainable.",
tags:["bamboo","sustainable","soft","jersey"],
image:"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80", featured:true },
{ id:11, name:"Heavy Denim — Selvedge", category:"Cotton", origin:"Japan", gsm:"420gsm", width:"75cm", minOrder:"100m",
priceGBP:{min:22.00,max:30.00,unit:"m"},
description:"Authentic Japanese selvedge denim woven on vintage shuttle looms. The gold standard of denim.",
tags:["selvedge","denim","Japanese","premium"],
image:"https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80" },
{ id:12, name:"Jacquard Brocade — Gold Thread", category:"Silk", origin:"India", gsm:"220gsm", width:"110cm", minOrder:"30m",
priceGBP:{min:28.00,max:42.00,unit:"m"},
description:"Ornate silk brocade with gold thread weaving. Traditional Indian craftsmanship for ceremonial wear.",
tags:["brocade","ceremonial","gold-thread","luxury"],
image:"https://images.unsplash.com/photo-1702590447514-01cbee1ccabc?auto=format&fit=crop&w=600&q=80", featured:true },
];

export const CATEGORIES = ["All","Cotton","Linen","Silk","Synthetic","Blends","Finished"] as const;
export type Category = typeof CATEGORIES[number];
