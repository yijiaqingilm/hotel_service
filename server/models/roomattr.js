/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roomattr', {
    rmattrId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    maxck: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    size: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    minbooking: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    maxbooking: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    floorRange: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deposit: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    oprice: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    vipprice: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'roomattr'
  });
};
