import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Candidate from '../models/candidateModel.js';



const followCandidate = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const userId = res.locals.user._id;

    const user = await User.findById(userId);
    if (user.followingCandidate.length > 0) {
      // User is already following a candidate, so we return an error
      return res.status(400).json({
        succeeded: false,
        error: "Sadece bir defa oy kullanabilirsiniz",
      });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      // Candidate with the specified ID doesn't exist
      return res.status(404).json({
        succeeded: false,
        error: "Candidate not found",
      });
    }

    // Get the user's city
    const userCity = user.cityfrom;

    // Add the user's ID and city to the candidate's followers array
    candidate.followers.push({ userId, city: userCity });
    await candidate.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { followingCandidate: candidate.username } }
    );

    res.status(200).redirect(`/anket-sonuclari?success=true`);
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};


export {
  followCandidate,
};
