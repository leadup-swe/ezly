import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';
import CheckIcon from '@untitled-ui/icons-react/build/esm/Check';
import type { StepIconProps } from '@mui/material';
import { Avatar, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from '@mui/material';
import { JobCategoryStep } from './job-category-step';
import { JobDescriptionStep } from './job-description-step';
import { JobDetailsStep } from './job-details-step';
import { JobPreview } from './job-preview';
import { useForm } from 'react-hook-form';
import { NewJobProcedureInput } from '@api/resolvers/jobs/new';
import { trpc } from '../../../../../trpc';
import { useOrganization } from '@clerk/nextjs';

const StepIcon: FC<StepIconProps> = (props) => {
  const { active, completed, icon } = props;

  const highlight = active || completed;

  return (
    <Avatar
      sx={{
        height: 40,
        width: 40,
        ...(highlight && {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        }),
      }}
      variant='rounded'
    >
      {completed ? (
        <SvgIcon>
          <CheckIcon />
        </SvgIcon>
      ) : (
        icon
      )}
    </Avatar>
  );
};

export const JobCreateForm: FC = () => {
  const [ activeStep, setActiveStep ] = useState(0);
  const [ isComplete, setIsComplete ] = useState(false);
  const { handleSubmit, register, setValue } = useForm<NewJobProcedureInput>();
  const { mutate: createJob } = trpc.jobs.newJob.useMutation();
  const { organization } = useOrganization();

  const handleNext = useCallback(() => {
    setActiveStep((prevState) => prevState + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevState) => prevState - 1);
  }, []);

  const onSubmit = useCallback((data: NewJobProcedureInput) => {
    if (!organization) return;
    createJob(
      { ...data, organizationId: organization.id },
      {
        onSuccess: handleComplete,
      },
    );
  }, []);

  const handleComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  const steps = useMemo(() => {
    return [
      {
        label: `I'm looking for...`,
        content: <JobCategoryStep onBack={handleBack} onNext={handleNext} />,
      },
      {
        label: 'What is the job about?',
        content: <JobDetailsStep onBack={handleBack} onNext={handleNext} register={register} setValue={setValue} />,
      },
      {
        label: 'How would you describe the job post?',
        content: <JobDescriptionStep onBack={handleBack} setValue={setValue} onSubmit={handleSubmit(onSubmit)} />,
      },
    ];
  }, [ handleBack, handleNext, handleComplete ]);

  if (isComplete) {
    return <JobPreview />;
  }

  return (
    <Stepper
      activeStep={activeStep}
      orientation='vertical'
      sx={{
        '& .MuiStepConnector-line': {
          borderLeftColor: 'divider',
          borderLeftWidth: 2,
          ml: 1,
        },
      }}
    >
      {steps.map((step, index) => {
        const isCurrentStep = activeStep === index;

        return (
          <Step key={step.label}>
            <StepLabel StepIconComponent={StepIcon}>
              <Typography sx={{ ml: 2 }} variant='h6'>
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent
              sx={{
                borderLeftColor: 'divider',
                borderLeftWidth: 2,
                ml: '20px',
                ...(isCurrentStep && {
                  py: 4,
                }),
              }}
            >
              {step.content}
            </StepContent>
          </Step>
        );
      })}
    </Stepper>
  );
};
