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

import { TModelInfo } from '@/interface/model';
import GroupAccountBookModel from './groupAccountBook';
import CronGroupAccountBookModel from './cronGroupAccountBook';

export class GroupModel extends Model<
	InferAttributes<GroupModel>,
	InferCreationAttributes<GroupModel>
> {
	declare accessHistory: Date;
	declare accountBookId: ForeignKey<AccountBookModel['id']>;
	declare accountbooks?: NonAttribute<AccountBookModel>;
	declare addCrongroupaccountbook: HasManyAddAssociationMixin<
		CronGroupAccountBookModel,
		number
	>;
	declare addCrongroupaccountbooks: HasManyAddAssociationsMixin<
		CronGroupAccountBookModel,
		number
	>;
	declare addGroupaccountbook: HasManyAddAssociationMixin<GroupAccountBookModel, number>;
	declare addGroupaccountbooks: HasManyAddAssociationsMixin<
		GroupAccountBookModel,
		number
	>;
	declare countCrongroupaccountbooks: HasManyCountAssociationsMixin;
	declare countGroupaccountbooks: HasManyCountAssociationsMixin;
	declare createCrongroupaccountbook: HasManyCreateAssociationMixin<
		CronGroupAccountBookModel,
		'groupId'
	>;
	declare createdAt: CreationOptional<Date>;
	declare createGroupaccountbook: HasManyCreateAssociationMixin<
		GroupAccountBookModel,
		'groupId'
	>;
	declare crongroupaccountbooks?: NonAttribute<CronGroupAccountBookModel[]>;
	declare getCrongroupaccountbooks: HasManyGetAssociationsMixin<CronGroupAccountBookModel>;
	declare getGroupaccountbooks: HasManyGetAssociationsMixin<GroupAccountBookModel>;
	declare groupaccountbooks?: NonAttribute<GroupAccountBookModel[]>;
	declare hasCrongroupaccountbook: HasManyHasAssociationMixin<
		CronGroupAccountBookModel,
		number
	>;
	declare hasCrongroupaccountbooks: HasManyHasAssociationsMixin<
		CronGroupAccountBookModel,
		number
	>;
	declare hasGroupaccountbook: HasManyHasAssociationMixin<GroupAccountBookModel, number>;
	declare hasGroupaccountbooks: HasManyHasAssociationsMixin<
		GroupAccountBookModel,
		number
	>;
	declare id: CreationOptional<number>;
	declare removeCrongroupaccountbook: HasManyRemoveAssociationMixin<
		CronGroupAccountBookModel,
		number
	>;
	declare removeCrongroupaccountbooks: HasManyRemoveAssociationsMixin<
		CronGroupAccountBookModel,
		number
	>;
	declare removeGroupaccountbook: HasManyRemoveAssociationMixin<
		GroupAccountBookModel,
		number
	>;
	declare removeGroupaccountbooks: HasManyRemoveAssociationsMixin<
		GroupAccountBookModel,
		number
	>;
	declare setCrongroupaccountbooks: HasManySetAssociationsMixin<
		CronGroupAccountBookModel,
		number
	>;
	declare setGroupaccountbooks: HasManySetAssociationsMixin<
		GroupAccountBookModel,
		number
	>;

	declare userEmail: ForeignKey<UserModel['email']>;
	declare users?: NonAttribute<UserModel>;
	/** owner, manager, writer, observer */
	declare userType: 'manager' | 'owner' | 'writer' | 'observer';
}

GroupModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		userType: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		accessHistory: {
			type: DataTypes.DATE,
			allowNull: false,
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
	GroupModel.belongsTo(model.users, {
		targetKey: 'email',
		foreignKey: 'userEmail',
		as: 'users',
	});
	GroupModel.belongsTo(model.accountbooks, {
		targetKey: 'id',
		foreignKey: 'accountBookId',
		as: 'accountbooks',
	});
	GroupModel.hasMany(model.groupaccountbooks, {
		onDelete: 'cascade',
		hooks: true,
		as: 'groupaccountbooks',
		foreignKey: { allowNull: false, name: 'groupId' },
		sourceKey: 'id',
	});
	GroupModel.hasMany(model.crongroupaccountbooks, {
		onDelete: 'cascade',
		hooks: true,
		as: 'crongroupaccountbooks',
		foreignKey: { allowNull: false, name: 'groupId' },
		sourceKey: 'id',
	});
};

export default GroupModel;
