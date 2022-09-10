const express=require('express');
require('dotenv').config({path:'config.env'});
const cors=require('cors');
const morgan=require('morgan');
const moment=require('moment');
const path=require('path');
const app=express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({extended:true,limit:'50mb'}));

const Chat=require('./models/Chat');

require('./db/conn');

const port=process.env.PORT || 8000;

app.use('/api/public',require('./routes/public.rou'));
app.use('/api/private',require('./routes/private.rou'));
app.use('/api/chat',require('./routes/chat'));

app.use('/api/category',require('./routes/category.rou'));

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname,  "client/build", "index.html"));
      });
}

const server=app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
})
const io=require('socket.io')(server,
    {
        cors: {
          origin: ["*"],
          methods: ["GET", "POST"]
        }
    });
    

io.on("connection",(socket)=>{
    console.log("Connected to socket!");
    socket.on('joined',({userId,roomId})=>{
        // console.log(roomId);
        socket.join(roomId);
    })
    socket.on("sendmessage",async({userId,roomId,message,isImage})=>{
        const chat=await Chat.findOneAndUpdate({_id:roomId},{
            $push:{
                allMessages:{senderId:userId,message,time:moment().format(),isImage}
            }
        },{new:true})
        console.log(userId);
        // const messages=await Message.find(,);
        // socket.to().emit("sendallmessages",{allMessages:chat.allMessages});
        io.to(roomId).emit("sendallmessages",{allMessages:chat.allMessages});
    })
})