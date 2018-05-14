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
    checkInTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    checkOutTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    vipprice: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    oprice: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    face: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tags: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    rooms: {
      type: DataTypes.INTEGER(11),
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
      allowNull: true
    }
  }, {
    tableName: 'room'
  });
};
