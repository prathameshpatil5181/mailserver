
export const users:{name:string;email:string}[] = [
  {
    name: "prathamesh",
    email: "prathamesh@prathamesh-de.me",
  },
  {
    name: "abhijeet",
    email: "abhijeet@prathamesh-de.me",
  }
];

export const FromHandler = (from:string):boolean=>{

    const result = users.find(x=>x.email==from);

    if(result){
        return true;
    }
    return false;
}