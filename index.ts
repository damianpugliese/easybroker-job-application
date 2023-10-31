import dotenv from "dotenv";
dotenv.config();

import { EasyBroker } from "./EasyBroker"

if(!process.env.API_KEY){
  throw new Error("API key not provided. You must place it in the .env file");
}

const easyBroker = new EasyBroker(process.env.API_KEY);

async function main() {
  try {
    const properties = await easyBroker.getAllProperties(50);

    easyBroker.printPropertiesTitle(properties);
  } catch (error) {
    console.error(error);
  }
}

main();