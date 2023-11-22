import  sequelize  from 'sequelize';
import {db} from '../../config/config'
 const cart = db.define('cart', {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: sequelize.INTEGER 
    },
    
    product_id: {
      type: sequelize.INTEGER,
    },
    quantity:{
        type: sequelize.INTEGER
    }
  
  },
    {
      timestamps: true,
       freezeTableName:true
    });
    
export default cart