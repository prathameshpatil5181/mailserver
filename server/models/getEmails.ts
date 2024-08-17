import prismaClient from "./prismaSetup";



 const getEmails =  async(limit:string)=>{


    const response = prismaClient.ai_mails_info.findMany({
        select:{
            to:true,
            from:true,
            cc:true,
            subject:true
        },
        where:{
            msg_id:'1111'
        },
      
    })

}

export default getEmails;