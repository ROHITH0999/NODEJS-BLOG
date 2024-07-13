const {Router} =require('express'); 
const {deletePost,editPost,getUserPosts,getCatPosts,getPost,getPosts,createPost} =require('../controllers/postControllers')
const authMiddleware = require('../middleware/authMiddleware');

const router=Router();

router.post('/',authMiddleware,createPost);
router.patch('/:id',authMiddleware,editPost);
router.delete('/:id',authMiddleware,deletePost);

router.get('/',getPosts);
router.get('/:id',getPost);
router.get('/categories/:category',getCatPosts);
router.get('/users/:id',getUserPosts);

module.exports=router;