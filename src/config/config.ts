import  {Sequelize}  from "sequelize";
import dotenv from 'dotenv'
dotenv.config()
export const db=new Sequelize(process.env.DB||"",
    process.env.USER||"",process.env.PASSWORD,{
        host: process.env.HOST,
        dialect: 'mysql',
    })

    

