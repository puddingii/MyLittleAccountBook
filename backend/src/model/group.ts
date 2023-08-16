/* eslint-disable no-use-before-define */
import {
	CreationOptional,
	DataTypes,
	ForeignKey,
	HasManyAddAssociationMixin,
	HasManyAddAssociationsMixin,
	HasManyCountAssociationsMixin,
	HasManyCreateAssociationMixin,
	HasManyGetAssociationsMixin,
	HasManyHasAssociationMixin,
	HasManyHasAssociationsMixin,
	HasManyRemoveAssociationMixin,
	HasManyRemoveAssociationsMixin,
	HasManySetAssociationsMixin,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from 'sequelize';

import sequelize from '@/loader/mysql';
import AccountBookModel from './accountBook';
import UserModel from './user';

import { TModelInfo } from '@/interface/user';
import GroupAccountBookModel from './groupAccountBook';

export class GroupModel extends Model<
	InferAttributes<GroupModel>,
	InferCreationAttributes<GroupModel>
> {
	declare accountBookId: ForeignKey<AccountBookModel['id']>;
	declare addGroupaccountbook: HasManyAddAssociationMixin<GroupAccountBookModel, number>;
	declare addGroupaccountbooks: HasManyAddAssociationsMixin<
		GroupAccountBookModel,
		number
	>;
	declare countGroupaccountbooks: HasManyCountAssociationsMixin;
	declare createdAt: CreationOptional<Date>;
	declare createGroupaccountbook: HasManyCreateAssociationMixin<
		GroupAccountBookModel,
		'groupId'
	>;
	declare getGroupaccountbooks: HasManyGetAssociationsMixin<GroupAccountBookModel>;
	declare groupaccountbooks?: NonAttribute<GroupAccountBookModel[]>;
	declare hasGroupaccountbook: HasManyHasAssociationMixin<GroupAccountBookModel, number>;
	declare hasGroupaccountbooks: HasManyHasAssociationsMixin<
		GroupAccountBookModel,
		number
	>;
	declare id: CreationOptional<number>;
	declare removeGroupaccountbook: HasManyRemoveAssociationMixin<
		GroupAccountBookModel,
		number
	>;
	declare removeGroupaccountbooks: HasManyRemoveAssociationsMixin<
		GroupAccountBookModel,
		number
	>;
	declare setGroupaccountbooks: HasManySetAssociationsMixin<
		GroupAccountBookModel,
		number
	>;
	declare userEmail: ForeignKey<UserModel['email']>;
}

GroupModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		createdAt: DataTypes.DATE,
	},
	{
		sequelize,
		modelName: 'groups',
		createdAt: true,
		updatedAt: false,
	},
);

export const associate = (model: TModelInfo) => {
	GroupModel.belongsTo(model.UserModel, {
		targetKey: 'email',
		foreignKey: 'userEmail',
		as: 'users',
	});
	GroupModel.belongsTo(model.AccountBookModel, {
		targetKey: 'id',
		foreignKey: 'accountBookId',
		as: 'accountbooks',
	});
	GroupModel.hasMany(model.GroupAccountBookModel, {
		onDelete: 'cascade',
		hooks: true,
		as: 'groupaccountbooks',
		foreignKey: { allowNull: false, name: 'groupId' },
		sourceKey: 'id',
	});
};

export default GroupModel;
