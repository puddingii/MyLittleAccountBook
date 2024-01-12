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
import UserModel from './user';

import { TModelInfo } from '@/interface/model';

export class UserPrivacyModel extends Model<
	InferAttributes<UserPrivacyModel>,
	InferCreationAttributes<UserPrivacyModel>
> {
	declare createdAt: CreationOptional<Date>;
	declare id: CreationOptional<number>;
	declare isAuthenticated: boolean;
	declare isGroupInvitationOn: boolean;
	declare isPublicUser: boolean;
	declare updatedAt: CreationOptional<Date>;
	declare userEmail: ForeignKey<UserModel['email']>;
	declare users?: NonAttribute<UserModel>;
}

UserPrivacyModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		isAuthenticated: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		isGroupInvitationOn: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		isPublicUser: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize,
		modelName: 'userprivacys',
		createdAt: true,
		updatedAt: true,
	},
);

export const associate = (model: TModelInfo) => {
	UserPrivacyModel.belongsTo(model.users, {
		targetKey: 'email',
		foreignKey: 'userEmail',
		as: 'users',
		hooks: true,
		onDelete: 'cascade',
	});
};

export default UserPrivacyModel;
