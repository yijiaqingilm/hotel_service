/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('room', {
    rid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    img: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    roomTypeId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'roomtype',
        key: 'roomTypeId'
      }
    },
    roomAttrId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'roomattr',
        key: 'rmattrId'
      }
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
    orderNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'room'
  });
};
