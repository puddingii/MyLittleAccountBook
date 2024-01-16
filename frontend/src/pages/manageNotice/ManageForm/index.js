import {
	Button,
	FormHelperText,
	Grid,
	InputLabel,
	Stack,
	OutlinedInput,
	Divider,
	TextareaAutosize,
	Box,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import {
	useCreateNoticeMutation,
	useDeleteNoticeMutation,
	useUpdateNoticeMutation,
} from 'queries/notice/noticeMutation';

import { manageNoticeSchema } from 'validation/manageNotice';

const initialValue = {
	title: '',
	content: '',
	isUpdateContent: false,
	submit: null,
};

const ManageForm = ({ curManagingNoticeState, noticeState, setSnackbarInfo, listRefetch }) => {
	const [curManagingNotice, setCurManagingNotice] = curManagingNoticeState;
	const curManaging = curManagingNotice && {
		title: curManagingNotice.title,
		content: curManagingNotice.content,
		isUpdateContent: curManagingNotice.isUpdateContent,
	};
	const combinedInitNotice = curManagingNotice ? { ...initialValue, ...curManaging } : initialValue;
	const { mutate: createMutate } = useCreateNoticeMutation();
	const { mutate: updateMutate } = useUpdateNoticeMutation();
	const { mutate: deleteMutate } = useDeleteNoticeMutation();

	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		const commonData = { content: values.content, title: values.title, isUpdateContent: values.isUpdateContent };
		const onErrorCallbackFunc = error => {
			setSnackbarInfo({ isOpen: true, message: error?.response?.data?.message, severity: 'error' });
			setStatus({ success: false });
			setErrors({ submit: error.message });
			setSubmitting(false);
		};
		const onSuccessCallbackFunc = message => {
			setCurManagingNotice(null);
			noticeState[1](-1);
			listRefetch();
			setSnackbarInfo({ isOpen: true, message, severity: 'success' });
			setStatus({ success: false });
			setSubmitting(false);
		};

		const handleUpdate = () => {
			updateMutate(
				{
					id: curManagingNotice.id,
					...commonData,
				},
				{
					onSuccess: response => {
						const count = (response.data?.count ?? [0])[0];
						if (!count) throw new Error('업데이트 에러. 관리자에게 문의주세요.');
						onSuccessCallbackFunc('공지가 생성되었습니다.');
					},
					onError: onErrorCallbackFunc,
				},
			);
		};
		const handleCreate = () => {
			createMutate(commonData, {
				onSuccess: response => {
					const data = response.data;
					if (!data) throw new Error('생성 에러. 관리자에게 문의주세요.');
					onSuccessCallbackFunc('공지가 생성되었습니다.');
				},
				onError: onErrorCallbackFunc,
			});
		};

		try {
			const mutate = curManagingNotice ? handleUpdate : handleCreate;
			mutate();
		} catch (error) {
			onErrorCallbackFunc(error);
		}
	};

	const handleDelete = () => {
		if (curManagingNotice) {
			deleteMutate(
				{ id: curManagingNotice.id },
				{
					onSuccess: response => {
						const count = response.data?.count;
						if (!count) throw new Error('삭제 에러. 관리자에게 문의주세요.');
						setCurManagingNotice(null);
						noticeState[1](-1);
						listRefetch();
						setSnackbarInfo({ isOpen: true, message: '삭제되었습니다.', severity: 'success' });
					},
					onError: error => {
						setSnackbarInfo({ isOpen: true, message: error?.response?.data?.message, severity: 'error' });
						setStatus({ success: false });
						setErrors({ submit: error.message });
						setSubmitting(false);
					},
				},
			);
		}
	};

	return (
		<Formik
			key={curManagingNotice}
			initialValues={combinedInitNotice}
			validationSchema={manageNoticeSchema}
			onSubmit={handleSubmit}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Stack spacing={1}>
								<InputLabel htmlFor="title">공지제목</InputLabel>
								<OutlinedInput
									id="title"
									type="text"
									value={values.title}
									name="title"
									onBlur={handleBlur}
									onChange={handleChange}
									fullWidth
									error={Boolean(touched.title && errors.title)}
								/>
								{touched.title && errors.title && (
									<FormHelperText error id="standard-weight-helper-text-title">
										{errors.title}
									</FormHelperText>
								)}
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={1}>
								<TextareaAutosize
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.content}
									name="content"
									minRows={18}
									maxRows={18}
								/>
								{touched.content && errors.content && (
									<FormHelperText error id="standard-weight-helper-text-content">
										{errors.content}
									</FormHelperText>
								)}
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								control={
									<Checkbox
										checked={values.isUpdateContent}
										onChange={e => setFieldValue('isUpdateContent', e.target.checked, true)}
									/>
								}
								label="해당 공지가 업데이트 관련인지"
							/>
						</Grid>
					</Grid>
					{errors.submit && (
						<Grid item xs={12}>
							<FormHelperText error>{errors.submit}</FormHelperText>
						</Grid>
					)}
					<Divider style={{ marginTop: '20px' }} />
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Button onClick={() => handleDelete()} variant="contained" color="error">
							삭제
						</Button>
						<Box sx={{ flex: '1 1 auto' }} />
						<Button type="submit" variant="contained" color="info">
							{curManagingNotice === null ? '생성' : '수정'}
						</Button>
					</Box>
				</form>
			)}
		</Formik>
	);
};

ManageForm.propTypes = {
	curManagingNoticeState: PropTypes.array,
	noticeState: PropTypes.array,
	setSnackbarInfo: PropTypes.func,
	listRefetch: PropTypes.func,
};

export default ManageForm;
