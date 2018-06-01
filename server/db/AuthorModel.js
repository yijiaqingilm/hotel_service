import sequelize from './sequelize'
import sysUsers from '../models/sys_users'
import sysRoles from '../models/sys_roles'
import sysRules from '../models/sys_rules'
import roomtype from '../models/roomtype'
import tag from '../models/tags'
import img from '../models/img'
import bed from '../models/bed'
import layout from '../models/layout'
import face2roomattr from '../models/face_roomattr'
import roomattr from '../models/roomattr'
import face from '../models/face'
import room from '../models/room'
import user from '../models/users'
import room2img from '../models/room_img'
import room2tag from '../models/room_tag'
import order2roomattr from '../models/order_roomattr'
import order from '../models/order'
import sysroles2rules from '../models/sys_roles_rules'
import order2room from '../models/order_room'

const SysUser = sequelize.import('sys_users', sysUsers)
const SysRole = sequelize.import('sys_roles', sysRoles)
const SysRule = sequelize.import('sys_rule', sysRules)
const SysRole2Rule = sequelize.import('sys_role_rule', sysroles2rules)
const RoomType = sequelize.import('room_type', roomtype)
const Tag = sequelize.import('tags', tag)
const Img = sequelize.import('img', img)
const Bed = sequelize.import('bed', bed)
const Layout = sequelize.import('layout', layout)
const Face = sequelize.import('face', face)
const RoomAttr = sequelize.import('roomattr', roomattr)
const Face2Roomattr = sequelize.import('face2roomattr', face2roomattr)
const Room = sequelize.import('room', room)
const User = sequelize.import('user', user)
const Room2Img = sequelize.import('room2img', room2img)
const Room2Tag = sequelize.import('room2tag', room2tag)
const Order2RoomAttr = sequelize.import('order2roomattr', order2roomattr)
const Order = sequelize.import('order', order)
const Order2Room = sequelize.import('order2room', order2room)
/* 系统用户 权限关系映射*/
SysRule.belongsToMany(SysRole, {through: SysRole2Rule, foreignKey: 'rules_id'})
SysRole.belongsToMany(SysRule, {through: SysRole2Rule, foreignKey: 'roles_id'})
SysRole.hasMany(SysUser, {foreignKey: 'roles_id'})
SysUser.belongsTo(SysRole, {foreignKey: 'roles_id'})
/* roomAttr 关系映射*/
RoomAttr.hasMany(Layout, {foreignKey: 'attrId'})
RoomAttr.hasMany(Bed, {foreignKey: 'attrId'})
RoomAttr.belongsToMany(Face, {through: Face2Roomattr, foreignKey: 'roomattrId'})
Face.belongsToMany(RoomAttr, {through: Face2Roomattr, foreignKey: 'faceId'})
RoomAttr.belongsToMany(Order, {through: Order2RoomAttr, foreignKey: 'roomAttrId'})
Order.belongsToMany(RoomAttr, {through: Order2RoomAttr, foreignKey: 'orderId'})

/* room 关系映射*/
RoomAttr.hasMany(Room, {foreignKey: 'roomAttrId'})
Room.belongsTo(RoomAttr, {foreignKey: 'roomAttrId', as: 'roomAttr'})
Room.belongsToMany(Img, {through: Room2Img, foreignKey: 'room_id'})
Img.belongsToMany(Room, {through: Room2Img, foreignKey: 'img_id'})
Room.belongsToMany(Tag, {through: Room2Tag, foreignKey: 'room_id'})
Tag.belongsToMany(Room, {through: Room2Tag, foreignKey: 'tag_id'})

/* 订单 关系映射*/
Order.belongsToMany(Room, {through: Order2Room, foreignKey: 'order_id', as: 'room'})
Room.belongsToMany(Order, {through: Order2Room, foreignKey: 'room_id'})
Order.belongsTo(User, {foreignKey: 'uId', as: 'user'})

export {
  SysUser,
  SysRole,
  SysRule,
  SysRole2Rule,
  RoomType,
  Tag,
  Img,
  Bed,
  Face,
  RoomAttr,
  Layout,
  Face2Roomattr,
  Room,
  User,
  Room2Img,
  Room2Tag,
  Order2RoomAttr,
  Order,
  Order2Room
}
