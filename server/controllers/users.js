import User from "../models/User.js";

/* READ */
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user._doc;
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
};

export const getUserFriends = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId))
    );

    const formattedFriends = friends
      .filter(Boolean)
      .map(({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      }));

    res.status(200).json(formattedFriends);
  } catch (err) {
    next(err);
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res, next) => {
  try {
    const { id, friendId } = req.params;
    
    if (id === friendId) {
      return res.status(400).json({ message: "Cannot add yourself as a friend" });
    }

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    const isFriend = user.friends.includes(friendId);

    if (isFriend) {
      // Remove from both users' friend lists
      user.friends = user.friends.filter((fId) => fId.toString() !== friendId);
      friend.friends = friend.friends.filter((fId) => fId.toString() !== id);
    } else {
      // Add to both users' friend lists
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await Promise.all([user.save(), friend.save()]);

    const updatedFriends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId))
    );

    const formattedFriends = updatedFriends
      .filter(Boolean)
      .map(({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      }));

    res.status(200).json(formattedFriends);
  } catch (err) {
    next(err);
  }
};

/* UPDATE PROFILE */
export const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, location, occupation } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields that are provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (location) user.location = location;
    if (occupation) user.occupation = occupation;
    if (req.file) user.picturePath = req.file.filename;

    const updatedUser = await user.save();
    const { password, ...userWithoutPassword } = updatedUser._doc;
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
};
