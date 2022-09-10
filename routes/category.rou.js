const router=require('express').Router();
const {addCategory,getCategory}=require('../controllers/category.con');

router.post('/addcat',addCategory);

router.get('/getcat',getCategory);

module.exports=router;