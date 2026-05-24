const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    bio: { 
        type: String, 
        required: true 
    },
    image_path: { 
        type: String, 
        required: true 
    },
}, {
    timestamps: true, // Yeh 'createdAt' aur 'updatedAt' fields apne aap bana dega
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;