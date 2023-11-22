import  sequelize  from 'sequelize';
import {db} from '../../config/config'
 const Product = db.define('product', {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ProductName: {
      type: sequelize.STRING // Use the appropriate data type for the name field
    },
    Category: {
      type: sequelize.STRING,
    },
    Dicription:
    {
      type: sequelize.STRING,
  
    },
    Price:{
        type: sequelize.INTEGER,
    },
    Image:{
        type: sequelize.STRING,
        
      get() {
          return this.getDataValue('Image').split(',')
      },
      set(val:any) {
         this.setDataValue('Image',val.join(','));
      }
      
    },quantity:{
        type: sequelize.INTEGER
    },
    discount:
    {
      type: sequelize.INTEGER
    }
  
  },
    {
      timestamps: true,
       freezeTableName:true
    });
    
export default Product