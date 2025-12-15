import Category from "../models/Category.js";

export const getExamCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};



