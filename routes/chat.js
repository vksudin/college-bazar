const router=require('express').Router();
const {protect}=require('../middlewares/protect');
const {createChat,getAChat}=require('../controllers/chat');

router.post('/create',protect,createChat);
router.get('/get/:roomId',protect,getAChat);

module.exports=router;