import prismaClient from "./prismaSetup";
import { Iinsertdatabase } from "../utils/intefacses";

export const storeMessages = async (insertdatabase: Iinsertdatabase) => {
  console.log(insertdatabase);
};
