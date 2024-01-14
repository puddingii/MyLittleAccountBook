export const QUERY_KEY = {
	emailLogin: `${process.env.REACT_APP_BACKEND_API}/auth/email`,
	verifyEmail: `${process.env.REACT_APP_BACKEND_API}/auth/email/verify`,
	resendEmail: `${process.env.REACT_APP_BACKEND_API}/auth/email/resend`,
	socialLogin: `${process.env.REACT_APP_BACKEND_API}/auth/social`,
	join: `${process.env.REACT_APP_BACKEND_API}/auth/join`,
	token: `${process.env.REACT_APP_BACKEND_API}/auth/token`,
	validate: `${process.env.REACT_APP_BACKEND_API}/group/validate`,
	validateSuperAdmin: `${process.env.REACT_APP_BACKEND_API}/auth/validate/superdmin`,
};
