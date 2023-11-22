import  sequelize  from 'sequelize';
import {db} from '../../config/config'
 const order_item = db.define('order_item', {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: sequelize.INTEGER // Use the appropriate data type for the name field
    },
    product_id: {
      type: sequelize.INTEGER,
    },
    order_id:{
        type: sequelize.INTEGER
      },
    quantity:{
        type: sequelize.INTEGER
    },
  price:{
    type: sequelize.INTEGER
  },
  subtotal:{
    type: sequelize.INTEGER
  }
  },
    {
      timestamps: true,
       freezeTableName:true
    });
    
export default order_item