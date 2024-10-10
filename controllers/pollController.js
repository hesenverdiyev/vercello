import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Poll from '../models/pollModel.js';
import Comment from '../models/commentModel.js';

const getAllPolls = async (req, res) => {  
    try {
    const polls = await Poll.find({});
    res.status(200).render('polls', {
      polls,
      link: 'polls',
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
  };

  const getAPoll = async (req, res) => {
    try {
      const userId = res.locals.user ? res.locals.user.id : null;

      const polls = await Poll.find({});
      let pollname = req.params.pollname;
  
      const comments = await Comment.find({ pageFrom: pollname })
        .sort({ commentDate: 'desc' }); // Sort by commentDate field in descending order
  
      let poll = await Poll.findOne({ pollname: pollname });
      let { _id, pollquestion, options } = poll;
  
      req.session.returnTo = `/polls/${pollname}`;
  
      const results = options.map(option => ({
        title: option.title,
        picture: option.picture,
        votes: option.voters.length,
      })).sort((a, b) => b.votes - a.votes);
  
      res.render('poll', { polls, poll, pollname, options, pollquestion, _id, results, comments, userId, link: 'poll' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Anket sonuçları alınırken bir hata oluştu');
    }
  };
   

  const pollVoting = async (req, res) => {
    try {
      const user = await User.findById(res.locals.user._id);
      if (user.followingPolls.includes(req.params.pollname)) {
        return res.status(400).send({ message: 'Bu anketde daha önce oy kullandınız' });
      }

      let poll = await Poll.findOneAndUpdate(
        { pollname: req.params.pollname, 'options.title': req.body.optiontitle },
        { $addToSet: { 'options.$.voters': { userId: res.locals.user._id } } },
        { new: true }
      );
  
      await User.findByIdAndUpdate(
        res.locals.user._id,
        { $push: { followingPolls: req.params.pollname } }
      );
  
      return res.send({ message: 'Başarıyla oy kullandınız', poll });
    } catch (error) {
      console.log('Error:', error);
      return res.status(500).send({ message: 'Internal server error' });
    }
  };

  const pollCommenting = async (req, res) => {
    try {
      const pageFrom = req.params.pollname;
      
      const commenterId = res.locals.user._id;
      const { commenterName, commentText } = req.body;
  
      const comment = await Comment.create({
        pageFrom,
        commenterId,
        commenterName,
        commentText
      });
  
      res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export {
    getAllPolls,
    getAPoll,
    pollVoting,
    pollCommenting
  }; 