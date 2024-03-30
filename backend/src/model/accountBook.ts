/* eslint-disable no-use-before-define */
import {
	CreationOptional,
	DataTypes,
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
import type GroupModel from './group';
import type CategoryModel from './category';
import type AccountBookMediaModel from './accountBookMedia';

import { TModelInfo } from '@/interface/model';

/**
 * 가계부 설명
 */
class AccountBookModel extends Model<
	InferAttributes<AccountBookModel>,
	InferCreationAttributes<AccountBookModel>
> {
	declare accountbookmedias?: NonAttribute<AccountBookMediaModel>;
	declare addAccountbookmedia: HasManyAddAssociationMixin<AccountBookMediaModel, number>;
	declare addAccountbookmedias: HasManyAddAssociationsMixin<
		AccountBookMediaModel,
		number
	>;
	declare addCategory: HasManyAddAssociationMixin<CategoryModel, number>;
	declare addCategorys: HasManyAddAssociationsMixin<CategoryModel, number>;
	declare addGroup: HasManyAddAssociationMixin<GroupModel, number>;
	declare addGroups: HasManyAddAssociationsMixin<GroupModel, number>;
	declare categorys?: NonAttribute<CategoryModel[]>;
	declare content?: string;
	declare countAccountbookmedias: HasManyCountAssociationsMixin;
	declare countCategorys: HasManyCountAssociationsMixin;
	declare countGroups: HasManyCountAssociationsMixin;
	declare createAccountbookmedia: HasManyCreateAssociationMixin<
		AccountBookMediaModel,
		'accountBookId'
	>;
	declare createCategory: HasManyCreateAssociationMixin<CategoryModel, 'accountBookId'>;
	declare createdAt: CreationOptional<Date>;
	declare createGroup: HasManyCreateAssociationMixin<GroupModel, 'accountBookId'>;
	declare getAccountbookmedias: HasManyGetAssociationsMixin<AccountBookMediaModel>;
	declare getCategorys: HasManyGetAssociationsMixin<CategoryModel>;
	declare getGroups: HasManyGetAssociationsMixin<GroupModel>;
	declare groups?: NonAttribute<GroupModel[]>;
	declare hasAccountbookmedia: HasManyHasAssociationMixin<AccountBookMediaModel, number>;
	declare hasAccountbookmedias: HasManyHasAssociationsMixin<
		AccountBookMediaModel,
		number
	>;
	declare hasCategory: HasManyHasAssociationMixin<CategoryModel, number>;
	declare hasCategorys: HasManyHasAssociationsMixin<CategoryModel, number>;
	declare hasGroup: HasManyHasAssociationMixin<GroupModel, number>;
	declare hasGroups: HasManyHasAssociationsMixin<GroupModel, number>;
	declare id: CreationOptional<number>;
	declare removeAccountbookmedia: HasManyRemoveAssociationMixin<
		AccountBookMediaModel,
		number
	>;
	declare removeAccountbookmedias: HasManyRemoveAssociationsMixin<
		AccountBookMediaModel,
		number
	>;
	declare removeCategory: HasManyRemoveAssociationMixin<CategoryModel, number>;
	declare removeCategorys: HasManyRemoveAssociationsMixin<CategoryModel, number>;
	declare removeGroup: HasManyRemoveAssociationMixin<GroupModel, number>;
	declare removeGroups: HasManyRemoveAssociationsMixin<GroupModel, number>;
	declare setAccountbookmedias: HasManySetAssociationsMixin<
		AccountBookMediaModel,
		number
	>;
	declare setCategorys: HasManySetAssociationsMixin<CategoryModel, number>;
	declare setGroups: HasManySetAssociationsMixin<GroupModel, number>;
	declare title: string;
	declare updatedAt: CreationOptional<Date>;
}

AccountBookModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize,
		modelName: 'accountbooks',
		createdAt: true,
		updatedAt: true,
	},
);

export const associate = (model: TModelInfo) => {
	AccountBookModel.hasMany(model.groups, {
		onDelete: 'cascade',
		hooks: true,
		as: 'groups',
		foreignKey: { allowNull: false, name: 'accountBookId' },
		sourceKey: 'id',
	});
	AccountBookModel.hasMany(model.categorys, {
		onDelete: 'cascade',
		hooks: true,
		as: 'categorys',
		foreignKey: { allowNull: false, name: 'accountBookId' },
		sourceKey: 'id',
	});
	AccountBookModel.hasOne(model.accountbookmedias, {
		onDelete: 'cascade',
		hooks: true,
		as: 'accountbookmedias',
		foreignKey: { allowNull: false, name: 'accountBookId' },
		sourceKey: 'id',
	});
};

export default AccountBookModel;
