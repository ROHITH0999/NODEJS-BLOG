const {Router} =require('express'); 
const {registerUser,getAuthors,editUser,changeAvatar,getUser,loginUser} =require('../controllers/userControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router=Router();

router.get('/',getAuthors)
router.get('/:id',getUser)

router.post('/register',registerUser)
router.post('/login',loginUser)
router.patch('/edit-user',authMiddleware,editUser)
router.post('/change-avatar',authMiddleware, changeAvatar)

module.exports=router;