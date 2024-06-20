const User = require('../models/user');

async function suggestFriends(userId) {
    const user = await User.findById(userId).populate('followers followings');
    if (!user) {
        throw new Error('User not found');
    }

    const potentialFriends = await User.find({
        _id: { $ne: userId, $nin: user.followings },
        $or: [
            { followers: { $in: user.followers } },
            { followings: { $in: user.followings } }
        ]
    }).limit(10);

    return potentialFriends;
}

module.exports = { suggestFriends };
