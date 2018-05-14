/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('room_img', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    room_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'room',
        key: 'rid'
      }
    },
    img_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'img',
        key: 'imgId'
      }
    }
  }, {
    tableName: 'room_img'
  });
};
