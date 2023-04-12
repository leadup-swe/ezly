import { useState } from 'react';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Stack, SvgIcon } from '@mui/material';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';

interface Props {
  onSubmit: (args?: any) => void
  onBack: () => void
  isLoading: boolean
}

export const TermsStep = ({ onSubmit, onBack, isLoading }: Props) => {
  const [ checked, setChecked ] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  return (
    <Stack spacing={3}>
      <FormControlLabel control={<Checkbox value={checked} onChange={handleChange} />} label='I accept the terms and conditions' />

      <Stack alignItems='center' direction='row' spacing={2}>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Button
            endIcon={
              <SvgIcon>
                <ArrowRightIcon />
              </SvgIcon>
            }
            variant='contained'
            onClick={onSubmit}
            disabled={!checked || isLoading}
          >
            {'Signup'}
          </Button>
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                color: `green.500`,
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
        <Button color='inherit' onClick={onBack} disabled={isLoading}>
          {'Back'}
        </Button>
      </Stack>
    </Stack>
  );
};
