const mongoose = require('mongoose');
const User = require('../models/user');

async function suggestFriends(userId) {
    const user = await User.findById(userId).populate('followers followings');
    if (!user) {
        throw new Error('User not found');
    }

    // Extracting followers and followings ids for better readability
    const userFollowers = user.followers.map(follower => follower._id);
    const userFollowings = user.followings.map(following => following._id);

    // Calculate mutual friends and common interests
    const potentialFriends = await User.aggregate([
        {
            $match: {
                _id: { $ne: user._id, $nin: userFollowings }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'followers',
                foreignField: '_id',
                as: 'followersDetails'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'followings',
                foreignField: '_id',
                as: 'followingsDetails'
            }
        },
        {
            $project: {
                username: 1,
                profilePic: 1,
                mutualFollowers: {
                    $size: {
                        $setIntersection: ['$followers', userFollowers]
                    }
                },
                mutualFollowings: {
                    $size: {
                        $setIntersection: ['$followings', userFollowings]
                    }
                }
            }
        },
        {
            $addFields: {
                mutualScore: {
                    $add: ['$mutualFollowers', '$mutualFollowings']
                }
            }
        },
        {
            $sort: {
                mutualScore: -1
            }
        },
        {
            $limit: 7
        }
    ]);

    return potentialFriends;
}

module.exports = { suggestFriends };


/** 
 * Explanation:
Extract Followers and Followings IDs: Convert the followers and followings arrays into arrays of IDs for easier processing.
Aggregation Pipeline:
$match: Filter out the current user and users they are already following.
$lookup: Join the followers and followings fields to get detailed user information.
$project: Calculate the number of mutual followers and followings.
$addFields: Combine mutual followers and followings into a mutualScore.
$sort: Sort by mutualScore to prioritize users with higher mutual connections.
$limit: Limit the results to the top 10 suggestions.
 * 
 * 
*/