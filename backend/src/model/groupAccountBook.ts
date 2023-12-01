/* eslint-disable no-use-before-define */
import {
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from 'sequelize';

import sequelize from '@/loader/mysql';
import CategoryModel from './category';
import GroupModel from './group';

import { TModelInfo } from '@/interface/model';
import { TColumnType } from '@/interface/user';

export class GroupAccountBookModel extends Model<
	InferAttributes<GroupAccountBookModel>,
	InferCreationAttributes<GroupAccountBookModel>
> {
	declare categoryId: ForeignKey<CategoryModel['id']>;
	declare categorys?: NonAttribute<CategoryModel>;
	declare content?: string;
	declare createdAt: CreationOptional<Date>;
	declare groupId: ForeignKey<GroupModel['id']>;
	declare groups?: NonAttribute<GroupModel>;
	declare id: CreationOptional<number>;
	declare spendingAndIncomeDate: Date;
	declare type: TColumnType;
	declare value: number;
}

GroupAccountBookModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		value: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		spendingAndIncomeDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		createdAt: DataTypes.DATE,
	},
	{
		sequelize,
		modelName: 'groupaccountbooks',
		createdAt: true,
		updatedAt: false,
	},
);

export const associate = (model: TModelInfo) => {
	GroupAccountBookModel.belongsTo(model.groups, {
		targetKey: 'id',
		foreignKey: 'groupId',
		as: 'groups',
	});
	GroupAccountBookModel.belongsTo(model.categorys, {
		targetKey: 'id',
		foreignKey: 'categoryId',
		as: 'categorys',
	});
};

export default GroupAccountBookModel;
