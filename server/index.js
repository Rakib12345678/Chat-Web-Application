const express=require("express");//it framework for node js
const cors=require("cors");//cross origin resource sharing refers to the method that allows you to make requests to th eserver deployed at a different domain.as a reference if fronted and backend are at two different domains ,se need cors

const mongoose=require("mongoose");
const app=express();
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messagesRoute");
const socket = require("socket.io");
require("dotenv").config();//Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. 
app.use(cors());
app.use(express.json());



mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });
  app.use("/api/auth", authRoutes);
  app.use("/api/messages", messageRoutes);
  
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
