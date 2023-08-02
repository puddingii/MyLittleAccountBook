import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import sequelize from '@/loader/mysql';

export class UserModel extends Model<
	InferAttributes<UserModel>,
	InferCreationAttributes<UserModel>
> {
	declare email: string;
	declare nickname: string;
	declare password: string;
	declare token?: string;
}

UserModel.init(
	{
		nickname: {
			primaryKey: true,
			type: DataTypes.STRING,
		},
		email: {
			unique: true,
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ sequelize, modelName: 'users' },
);

export default UserModel;
