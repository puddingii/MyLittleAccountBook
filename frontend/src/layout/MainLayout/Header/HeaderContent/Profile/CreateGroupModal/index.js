import { useState } from 'react';
import PropTypes from 'prop-types';
import { Backdrop, Stepper, Step, StepLabel, Box, Typography, Fade, Modal, Snackbar, Alert } from '@mui/material';
import CreateGroup from './CreateGroup';
import InviteUser from './InviteUser';
import CompleteStep from './CompleteStep';

const steps = [
	{ title: '새 가계부 설정', optional: false },
	{ title: '사용자 추가', optional: true },
	{ title: '생성하기', optional: false },
];
const boxStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 800,
	height: 600,
	bgcolor: 'background.paper',
	// border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const CreateGroupModal = ({ open, handleClose }) => {
	const [activeStep, setActiveStep] = useState(0);
	const [groupInfo, setGroupInfo] = useState({});
	const [invitedUserList, setInvitedUserList] = useState([]);
	const [snackbarInfo, setSnackbarInfo] = useState({ isOpen: false, message: '', severity: 'info' });
	const [skipped, setSkipped] = useState(new Set());

	const handleCloseSnackbar = () => {
		setSnackbarInfo(beforeInfo => ({ ...beforeInfo, isOpen: false }));
	};

	const isStepOptional = step => {
		return steps[step].optional;
	};

	const isStepSkipped = step => {
		return skipped.has(step);
	};

	const handleNext = () => {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		setActiveStep(prevActiveStep => prevActiveStep + 1);
		setSkipped(newSkipped);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const handleSkip = () => {
		if (!isStepOptional(activeStep)) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.");
		}

		setActiveStep(prevActiveStep => prevActiveStep + 1);
		setSkipped(prevSkipped => {
			const newSkipped = new Set(prevSkipped.values());
			newSkipped.add(activeStep);
			return newSkipped;
		});
	};

	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={open}
			onClose={handleClose}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					timeout: 500,
				},
			}}
		>
			<Fade in={open}>
				<Box sx={boxStyle}>
					<Stepper alternativeLabel activeStep={activeStep}>
						{steps.map((label, index) => {
							const labelProps = {};
							const stepProps = {};
							if (label.optional) {
								labelProps.optional = <Typography variant="caption">선택사항</Typography>;
							}
							if (isStepSkipped(index)) {
								stepProps.completed = false;
							}
							return (
								<Step key={label.title} {...stepProps}>
									<StepLabel {...labelProps}>{label.title}</StepLabel>
								</Step>
							);
						})}
					</Stepper>
					<CreateGroup
						setGroupInfo={setGroupInfo}
						handleNext={handleNext}
						handleBack={handleBack}
						activeStep={activeStep}
						step={0}
						isStepOptional={isStepOptional(activeStep)}
						isDisabledComplete={false}
						stepLength={steps.length - 1}
						setSnackbarInfo={setSnackbarInfo}
					/>
					<InviteUser
						setGroupInfo={setGroupInfo}
						handleNext={handleNext}
						handleBack={handleBack}
						handleSkip={handleSkip}
						activeStep={activeStep}
						step={1}
						isStepOptional={isStepOptional(activeStep) && invitedUserList.length < 1}
						isDisabledComplete={invitedUserList.length < 1}
						stepLength={steps.length - 1}
						setSnackbarInfo={setSnackbarInfo}
						invitedUserList={invitedUserList}
						setInvitedUserList={setInvitedUserList}
					/>
					<CompleteStep
						handleBack={handleBack}
						activeStep={activeStep}
						step={2}
						isStepOptional={isStepOptional(activeStep)}
						stepLength={steps.length - 1}
						setSnackbarInfo={setSnackbarInfo}
						invitedUserList={invitedUserList}
						groupInfo={groupInfo}
						handleClose={handleClose}
					/>
					<Snackbar
						anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
						open={snackbarInfo.isOpen}
						onClose={handleCloseSnackbar}
						autoHideDuration={5000}
						key={'snackbarBox'}
					>
						<Alert onClose={handleCloseSnackbar} severity={snackbarInfo.severity} sx={{ width: '100%' }}>
							{snackbarInfo.message}
						</Alert>
					</Snackbar>
				</Box>
			</Fade>
		</Modal>
	);
};

CreateGroupModal.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
};

export default CreateGroupModal;
