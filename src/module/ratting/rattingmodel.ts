import  sequelize  from 'sequelize';
import {db} from '../../config/config'
 const rating = db.define('rating',{
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: 
    {
        type: sequelize.INTEGER // Use the appropriate data type for the name field
      },
      product_id:
        {
        type: sequelize.INTEGER
        },
        rating:
        {
            type: sequelize.INTEGER 
        }
  },
    {
      timestamps: true,
       freezeTableName:true
    });
    
export default rating