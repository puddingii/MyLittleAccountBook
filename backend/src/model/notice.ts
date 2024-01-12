/* eslint-disable no-use-before-define */
import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';

import sequelize from '@/loader/mysql';
import { TModelInfo } from '@/interface/model';

export class NoticeModel extends Model<
	InferAttributes<NoticeModel>,
	InferCreationAttributes<NoticeModel>
> {
	declare content: string;
	declare createdAt: CreationOptional<Date>;
	declare id: CreationOptional<number>;
	declare isUpdateContent: boolean;
	declare title: string;
	declare updatedAt: CreationOptional<Date>;
}

NoticeModel.init(
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
			allowNull: false,
		},
		isUpdateContent: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize,
		modelName: 'notices',
		createdAt: true,
		updatedAt: true,
	},
);

export const associate = (model: TModelInfo) => {};

export default NoticeModel;
