import UserModel from './user';
import OAuthUserModel from './oauthUser';

UserModel.hasMany(OAuthUserModel, {
	onDelete: 'cascade',
	hooks: true,
	as: 'oauthusers',
	foreignKey: { allowNull: false, name: 'userNickname' },
	sourceKey: 'nickname',
});

OAuthUserModel.belongsTo(UserModel, {
	targetKey: 'nickname',
	foreignKey: 'userNickname',
	as: 'users',
});
