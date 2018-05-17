/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('attrresult', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    faceName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bedName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    attrName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    width: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    bedQuantity: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    layoutName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    layoutQuantity: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    maxck: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    size: {
      type: DataTypes.FLOAT,
      allowNull: true
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
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'attrresult'
  });
};
