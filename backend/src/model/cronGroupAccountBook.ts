/* eslint-disable no-use-before-define */
import {
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NOW,
	NonAttribute,
} from 'sequelize';

import sequelize from '@/loader/mysql';
import CategoryModel from './category';
import GroupModel from './group';

import { TModelInfo } from '@/interface/model';
import { TColumnType, TCycleType } from '@/interface/user';

export class CronGroupAccountBookModel extends Model<
	InferAttributes<CronGroupAccountBookModel>,
	InferCreationAttributes<CronGroupAccountBookModel>
> {
	declare categoryId: ForeignKey<CategoryModel['id']>;
	declare categorys?: NonAttribute<CategoryModel>;
	declare content?: string;
	declare createdAt: CreationOptional<Date>;
	declare cycleTime: number;
	declare cycleType: TCycleType;
	declare groupId: ForeignKey<GroupModel['id']>;
	declare groups?: NonAttribute<GroupModel>;
	declare id: CreationOptional<number>;
	declare isActivated?: boolean;
	declare needToUpdateDate: Date;
	declare type: TColumnType;
	declare value: number;
}

CronGroupAccountBookModel.init(
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
			allowNull: false,
			defaultValue: '',
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		cycleTime: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		cycleType: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		needToUpdateDate: {
			type: DataTypes.DATE,
			defaultValue: NOW,
			allowNull: false,
		},
		isActivated: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: true,
		},
		createdAt: DataTypes.DATE,
	},
	{
		sequelize,
		modelName: 'crongroupaccountbooks',
		createdAt: true,
		updatedAt: false,
	},
);

export const associate = (model: TModelInfo) => {
	CronGroupAccountBookModel.belongsTo(model.groups, {
		targetKey: 'id',
		foreignKey: 'groupId',
		as: 'groups',
	});
	CronGroupAccountBookModel.belongsTo(model.categorys, {
		targetKey: 'id',
		foreignKey: 'categoryId',
		as: 'categorys',
	});
};

export default CronGroupAccountBookModel;
