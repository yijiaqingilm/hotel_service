/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order', {
    orderId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    uId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    couponId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sktime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ottime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    payType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    contact: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    addressId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'address',
        key: 'addressId'
      }
    },
    orderNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    source: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    payStatus: {
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
    },
    checkInTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    checkOutTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deposit: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    days: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
    }
  }, {
    tableName: 'order'
  });
};
