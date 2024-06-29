import { SMTPServer } from "smtp-server";
import "dotenv/config";

require("dotenv").config();

const emailServer = new SMTPServer({
  authOptional: true,
  allowInsecureAuth:true,
  onConnect(session, callback) {
    console.log("onConnect", session.id);
    callback(); //aaccpt the connection
  },

  onMailFrom(address,session,callback){
    console.log(`receiving mail from ${address}`);
    callback();
  },

  onRcptTo(address, session, callback) {
     console.log(`receiving mail from ${address}`);
     //check the is user available in database
     callback();
  },
  onData(stream,session,callback){
    stream.on('data',(data)=>{
      console.log('received data');
      console.log(data);
    })
    stream.on('end',()=>{
      callback();
    })
  }
});

emailServer.listen(process.env.EMAIL_PORT, () => {
  console.log(`server running on port ${process.env.EMAIL_PORT}`);
});
