import  sequelize  from "sequelize";
import { db } from "../../config/config";
const notification=db.define('notification',
{
    id: 
    {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
      user_id: {
        type: sequelize.INTEGER // Use the appropriate data type for the name field
      },
      order_id:{
        type: sequelize.INTEGER
      },
      message:{
        type: sequelize.STRING
      },
      key:{
        type: sequelize.BOOLEAN, allowNull: false, defaultValue: true
        
      }
},{
    timestamps: true,
     freezeTableName:true
  })
export default notification