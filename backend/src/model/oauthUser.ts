/* eslint-disable no-use-before-define */
import {
	CreationOptional,
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
	declare createdAt: CreationOptional<Date>;
	declare id: CreationOptional<number>;
	/** Type 종류: Default, Google, Naver */
	declare type: string;

	declare userEmail: ForeignKey<UserModel['email']>;
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
		createdAt: DataTypes.DATE,
	},
	{
		sequelize,
		modelName: 'oauthusers',
		createdAt: true,
		updatedAt: false,
	},
);

export default OAuthUser;
