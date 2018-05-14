/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('face_roomattr', {
    f_r_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    faceId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'face',
        key: 'faceId'
      }
    },
    roomattrId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'roomattr',
        key: 'rmattrId'
      }
    }
  }, {
    tableName: 'face_roomattr'
  });
};
