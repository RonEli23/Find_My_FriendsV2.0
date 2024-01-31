import mongoose from 'mongoose';

export const pet_details_schema = new mongoose.Schema({
        petName: String,
        petType: String,
        petGender: String,
        petBreeds: String,
        location: String,
        img:
        {
                data: Buffer,
                contentType: String
        },
        userEmail: String,
        status: String,
        note: String,
        date: {
                type: Date,
                // `Date.now()` returns the current unix timestamp as a number
                default: Date.now
        }
})

// const newPet = mongoose.model("newPet", newPet_schema);
// module.exports = user;