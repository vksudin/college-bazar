const {connect}=require('mongoose');
const db=process.env.MONGO_URI;

connect(db).then(()=>{
    console.log("DB Connected!");
}).catch((err)=>{
    console.log(err);
})