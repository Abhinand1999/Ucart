import  sequelize  from 'sequelize';
import {db} from '../../config/config'
 const order = db.define('order',{
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
        type: sequelize.INTEGER // Use the appropriate data type for the name field
      },
        TotalPrice:{
        type: sequelize.INTEGER,
    },
    quantity:{
        type: sequelize.INTEGER
    },
    status:{
        type: sequelize.STRING,
    },
    order_item:
    {
      type:sequelize.JSON,
      allowNull:false

    }
  },
    {
      timestamps: true,
       freezeTableName:true
    });
    
export default order