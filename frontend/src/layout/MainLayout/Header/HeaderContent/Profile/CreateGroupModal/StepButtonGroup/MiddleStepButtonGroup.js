import { Box, Button } from '@mui/material';
import PropTypes from 'prop-types';

const MiddleStepButtonGroup = ({
	handleBack,
	handleSkip,
	activeStep,
	isStepOptional,
	handleNext,
	isForm,
	stepLength,
}) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
			<Button color="inherit" style={{ display: activeStep === 0 ? 'none' : '' }} onClick={handleBack} sx={{ mr: 1 }}>
				뒤로가기
			</Button>
			<Box sx={{ flex: '1 1 auto' }} />
			{isStepOptional(activeStep) && (
				<Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
					건너뛰기
				</Button>
			)}

			<Button type={isForm ? 'submit' : 'button'} variant="contained" onClick={handleNext}>
				{activeStep === stepLength ? '생성' : '다음'}
			</Button>
		</Box>
	);
};

MiddleStepButtonGroup.propTypes = {
	handleBack: PropTypes.func.isRequired,
	handleSkip: PropTypes.func,
	handleNext: PropTypes.func.isRequired,
	activeStep: PropTypes.number.isRequired,
	stepLength: PropTypes.number.isRequired,
	isStepOptional: PropTypes.func.isRequired,
	isForm: PropTypes.bool.isRequired,
};

export default MiddleStepButtonGroup;
