import { Avatar, Stack, Typography } from '@mui/material';
import { User } from 'src/types/user';
import { trimString } from 'src/utils/trim-string';

interface Props {
  user: User
  trimName?: number
  showEmail?: boolean
}
export const UserListItem = ({ user: { id, firstname, lastname, avatar, email }, showEmail = false, trimName = 40 }: Props) => {
  const fullname = (firstname ? firstname : '') + (firstname ? ' ' : '') + (lastname ? lastname : !firstname && !lastname && email ? email : 'Anonymous');
  const initials = firstname ? firstname[0] : lastname ? lastname[0] : email ? email[0] : '?';

  return (
    <Stack direction='row' alignItems='center'>
      <Avatar alt={fullname} src={avatar} key={id} sx={{ width: 32, height: 32 }}>
        {initials}
      </Avatar>
      <Typography variant='body2' ml={1}>
        {trimString(fullname, trimName)}
      </Typography>
      {email && showEmail && <Typography variant='body2' color='neutral.400' ml={1}>{`<${email}>`}</Typography>}
    </Stack>
  );
};
