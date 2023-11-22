import  sequelize  from 'sequelize';
import {db} from '../../config/config'
 const User = db.define('user', {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Name: {
      type: sequelize.STRING // Use the appropriate data type for the name field
    },
    Email: {
      type: sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password:
    {
      type: sequelize.STRING,
  
    },
    Address:{
        type: sequelize.STRING,
    },
    pin:{
        type: sequelize.INTEGER, 
    }
  
  },
    {
      timestamps: true,
      freezeTableName:true
    });


export default User