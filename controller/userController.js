import User from "../models/User.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single user
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    const { name, grno, contact, password, role, classType } = req.body;
    const existing = await User.findOne({ grno });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Gr. No already exists" });

    console.log("{ name, grno, contact, password, role, classType }", {
      name,
      grno,
      contact,
      password,
      role,
      classType,
    });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, grno, contact, password:hashed, role, classType });
    await user.save();
    res.json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, grno, role, status, classType } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, grno, role, status, classType },
      { new: true }
    ).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.params.id);
    user.password = password;
    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
