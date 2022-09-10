const router=require('express').Router();
const {protect}=require('../middlewares/protect');
const {createPost,getItems,getFilteredItems,getSearchResults,getAPost,addToWishlist,removeFromWishlist,getDetails,informUser,buyItem,approveItem,getAllUser,blockUser,deleteItem,getItemsNotApproved,getAnUser}=require('../controllers/private.con');
const {createChat,getAChat}=require('../controllers/chat');

router.get('/getdetails',protect,getDetails);

router.post('/createpost',protect,createPost);

router.get('/getitems',protect,getItems);

router.post('/getfiltereditems',protect,getFilteredItems);

router.post('/getsearchresults',protect,getSearchResults);

router.get('/getapost/:id',protect,getAPost);

router.patch('/addtowishlist',protect,addToWishlist);

router.patch('/removefromwishlist',protect,removeFromWishlist);

router.post('/createchar',protect,createChat);

router.get('/getachat',protect,getAChat);

router.post('/informuser',protect,informUser);

router.delete('/buyitem/:itemId',protect,buyItem);

router.get('/getanuser/:userId',protect,getAnUser);

//admin
router.get('/unapproved',protect,getItemsNotApproved);
router.get('/approveitem/:itemId',protect,approveItem);
router.get('/deleteitem/:itemId',protect,deleteItem);
router.get('/blockuser/:userId',protect,blockUser);
router.get('/getalluser',protect,getAllUser);

module.exports=router;