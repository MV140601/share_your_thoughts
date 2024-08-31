import Users from "../models/user.model.js";
import Notifications from "../models/notification.model.js";
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary";


export const getUserInfo = async (req, res) => {
    const { userName } = req.params;
    console.log(userName);
    try {
        const user = await Users.findOne({ userName: userName }).select("-passWord");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ userData: user });
    } catch (err) {
        console.log("Error in fetching files", err.message);
        res.status(500).json({ error: err.message });
    }

}
export const UserAction = async (req, res) => {
    const { id } = req.params;
    const { currentUser } = req.user;
    console.log(id);
    try {
        const usertoAdDD = await Users.findById(id);
        const mainUser = await Users.findById(req.user._id.toString());
        if (id == req.user._id) {
            return res.status(400).json({ error: "You cannot follow or unfollow yourself" });
        }
        if (!usertoAdDD || !mainUser) {
            return res.status(400).json({ error: "User Not Found" });
        }
        const isFollowing = mainUser.following.includes(id);
        if (isFollowing) {
            await Users.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await Users.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ success: "Unfollowed Successfully" });
        } else {
            await Users.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await Users.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            const newNotification = new Notifications({
                type: "follow",
                from: req.user._id,
                to: usertoAdDD.id
            });
            await newNotification.save()
            res.status(200).json({ success: "Followed Successfully" });
        }

    } catch (err) {
        console.log("Error in UserAction", err.message);
        res.status(500).json({ error: err.message });
    }

}

export const getSuggestedUsers = async (req, res) => {

    try {
        const userId = req.user._id;
        const usersFollowedByme = await Users.findById(userId).select("following");
        const users = await Users.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            { $sample: { size: 10 } }
        ])

        const filteredUsers = users.filter(users => !usersFollowedByme.following.includes(userId));
        const suggestedUsers = filteredUsers.slice(0, 4);
        suggestedUsers.forEach(users => users.passWord = null);
        res.status(200).json(suggestedUsers);

    } catch (err) {
        console.log("Error in Suggested Users", err.message);
        res.status(500).json({ error: err.message });
    }
}


export const updateUserInfo = async (req, res) => {
	const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
	let { profileImg, coverImg } = req.body;
    console.log(req.user);
	const userId = req.user._id;

	try {
        console.log(userId);
		let user = await Users.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (profileImg) {
			if (user.profileImg) {
 				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

		user.fullName = fullName || user.fullName;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		// password should be null in response
		user.password = null;

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};