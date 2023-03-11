const mongoose = require('mongoose');
const {config} = require("../config/secret")

main().catch(err => console.log(err));

async function main() {
  mongoose.set('strictQuery', false);

  await mongoose.connect(config.urlDb);



  console.log("mongo connect noy atlas");
  
}