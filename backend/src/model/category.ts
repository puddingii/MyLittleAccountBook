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

import { TModelInfo } from '@/interface/model';
import GroupAccountBookModel from './groupAccountBook';

/**
 * 카테고리
 */
class CategoryModel extends Model<
	InferAttributes<CategoryModel>,
	InferCreationAttributes<CategoryModel>
> {
	declare accountBookId: ForeignKey<AccountBookModel['id']>;
	declare addGroupaccountbook: HasManyAddAssociationMixin<GroupAccountBookModel, number>;
	declare addGroupaccountbooks: HasManyAddAssociationsMixin<
		GroupAccountBookModel,
		number
	>;
	declare countGroupaccountbooks: HasManyCountAssociationsMixin;
	declare createGroupaccountbook: HasManyCreateAssociationMixin<
		GroupAccountBookModel,
		'categoryId'
	>;
	declare getGroupaccountbooks: HasManyGetAssociationsMixin<GroupAccountBookModel>;
	declare groupaccountbooks?: NonAttribute<GroupAccountBookModel[]>;
	declare hasGroupaccountbook: HasManyHasAssociationMixin<GroupAccountBookModel, number>;
	declare hasGroupaccountbooks: HasManyHasAssociationsMixin<
		GroupAccountBookModel,
		number
	>;
	declare id: CreationOptional<number>;
	declare name: string;
	declare parentId?: number;
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
}

CategoryModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		parentId: {
			type: DataTypes.INTEGER.UNSIGNED,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'categorys',
		createdAt: false,
		updatedAt: false,
	},
);

export const associate = (model: TModelInfo) => {
	CategoryModel.belongsTo(model.accountbooks, {
		targetKey: 'id',
		foreignKey: 'accountBookId',
		as: 'accountbooks',
	});
	CategoryModel.hasMany(model.groupaccountbooks, {
		onDelete: 'cascade',
		hooks: true,
		as: 'groupaccountbooks',
		foreignKey: { allowNull: false, name: 'categoryId' },
		sourceKey: 'id',
	});
};

export default CategoryModel;
