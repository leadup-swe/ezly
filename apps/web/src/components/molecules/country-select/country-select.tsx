import { Control, Controller } from 'react-hook-form';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { countries } from './countries';

type Props = {
  control: Control<any>
  name: string
};

const CountrySelect = ({ control, name }: Props) => {
  return (
    <Controller
      name='country'
      control={control}
      defaultValue=''
      render={({ field: { onChange, value } }) => (
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id='country-select-label'>{'Country'}</InputLabel>
          <Select labelId='country-select-label' id='country-select' label='Country' onChange={onChange} value={value}>
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};

export default CountrySelect;
