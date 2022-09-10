const router=require('express').Router();
const {createUser,getAllUsers,login}=require('../controllers/public.con');

router.post('/createuser',createUser);

router.get('/getallusers',getAllUsers);

router.post('/login',login);


module.exports=router;