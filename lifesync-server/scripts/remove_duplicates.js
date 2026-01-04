const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Define schema inline to avoid imports
const membershipSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
    role: { type: String, enum: ["owner", "editor", "viewer"], required: true },
}, { timestamps: true });

const Membership = mongoose.model("Membership", membershipSchema);

const removeDuplicates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Aggregate to find duplicates
        const duplicates = await Membership.aggregate([
            {
                $group: {
                    _id: { userId: "$userId", spaceId: "$spaceId" },
                    count: { $sum: 1 },
                    ids: { $push: "$_id" } // Keep all IDs
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]);

        console.log(`Found ${duplicates.length} duplicate groups.`);

        for (const group of duplicates) {
            // Sort IDs to keep the oldest one (or newest, depending on logic. Usually keep oldest)
            // group.ids is an array of ObjectIds
            const [keepId, ...removeIds] = group.ids;

            console.log(`Processing User: ${group._id.userId}, Space: ${group._id.spaceId}`);
            console.log(`Keeping: ${keepId}, Removing: ${removeIds.length} duplicates`);

            await Membership.deleteMany({ _id: { $in: removeIds } });
        }

        console.log("Cleanup complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

removeDuplicates();
