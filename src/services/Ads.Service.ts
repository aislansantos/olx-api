import Category from "@/models/Category";

interface Categories {
  name: string;
  slug: string;
  img: string;
}

export const getCategories = async () => {
  const cats = await Category.find().lean();

  const categories: Categories[] = [];

  for (const i in cats) {
    categories.push({
      ...cats[i],
      img: `${process.env.BASE}/assets/images/${cats[i].slug}.png`,
    });
  }

  return categories;
};
