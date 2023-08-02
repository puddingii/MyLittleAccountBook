import {
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';

import sequelize from '@/loader/mysql';
import UserModel from './user';

class OAuthUser extends Model<
	InferAttributes<OAuthUser>,
	InferCreationAttributes<OAuthUser>
> {
	declare id: number;
	declare token?: string;
	declare type: string;
	declare userNickname: ForeignKey<UserModel['nickname']>;
}

OAuthUser.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		token: {
			type: DataTypes.STRING,
		},
	},
	{ sequelize, modelName: 'oauthusers' },
);

export default OAuthUser;
