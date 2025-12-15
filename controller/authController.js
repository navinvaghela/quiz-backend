import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { name, grno, password, contact, classType } = req.body;

  const exists = await User.findOne({ grno });
  if (exists) return res.json({ msg: "GR. No. already exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, grno, password: hash, contact, classType, role:"student" });

  const userWithoutPassword = await User.findById(user._id).select("-password");

  res.json({ msg: "Registered", user: userWithoutPassword });
};

export const login = async (req, res) => {
  const { grno, password } = req.body;

  const user = await User.findOne({ grno });
  if (!user) return res.status(400).json({ msg: "Invalid login" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  const userWithoutPassword = await User.findById(user._id).select("-password");

  res.json({ token, user: userWithoutPassword });
};
