import { Typography } from '@mui/material';
import { Fragment } from 'react';
import PropTypes from 'prop-types';

import MiddleStepButtonGroup from './StepButtonGroup/MiddleStepButtonGroup';
import { useCreateAccountBookMutation } from 'queries/accountBook/accountBookMutation';

const CompleteStep = ({
	invitedUserList,
	groupInfo,
	setSnackbarInfo,
	activeStep,
	step,
	handleClose,
	...stepButtonProps
}) => {
	const { mutate } = useCreateAccountBookMutation();
	const handleNext = async () => {
		mutate(
			{ invitedUserList, ...groupInfo },
			{
				onSuccess: response => {
					const {
						data: { accountBookId },
					} = response;
					window.location.href = `/group/${accountBookId}/summary`;
					handleClose();
				},
				onError: error => {
					setSnackbarInfo({
						isOpen: true,
						message: error?.response?.data?.message ?? error.message,
						severity: 'error',
					});
				},
			},
		);
	};

	return (
		<Fragment>
			<div style={{ display: activeStep !== step ? 'none' : '' }}>
				<Typography sx={{ mt: 2, mb: 1 }}>&quot;{groupInfo.title}&quot;의 이름으로 가계부를 생성합니다.</Typography>
				<Typography sx={{ mt: 2, mb: 1 }}>
					총 {invitedUserList.length}명의 유저가 초대되었으며 추후 설정 페이지에서 수정 가능합니다.
				</Typography>
				<MiddleStepButtonGroup
					{...stepButtonProps}
					handleNext={handleNext}
					activeStep={activeStep}
					isDisabledComplete={false}
					handleSkip={() => {}}
					isForm={false}
				/>
			</div>
		</Fragment>
	);
};

CompleteStep.propTypes = {
	activeStep: PropTypes.number.isRequired,
	step: PropTypes.number.isRequired,
	invitedUserList: PropTypes.array.isRequired,
	setSnackbarInfo: PropTypes.func.isRequired,
	handleClose: PropTypes.func.isRequired,
	groupInfo: PropTypes.object.isRequired,
};

export default CompleteStep;
