import mongoose from 'mongoose';
import Comment from '../models/commentModel.js';


const deleteAComment = async (req, res) => {  
    const commentId = req.params.id;

    try {
      // find the comment by ID and delete it
      const result = await Comment.findByIdAndDelete(commentId);
      if (!result) {
        return res.status(404).send('Comment not found');
      }
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }

}

export {
    deleteAComment
  }; 