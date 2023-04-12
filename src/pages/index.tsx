import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';

export default function Home() {
  const r = useRouter();

  return (
    <div>
      <Box>
        <Button variant='contained' onClick={() => r.push('/login')}>
          {'Login'}
        </Button>
        <Button onClick={() => r.push('/signup')}>{'Signup'}</Button>
        <Button variant='contained' onClick={() => r.push('/dashboard')}>
          {'Dashboard'}
        </Button>
      </Box>
    </div>
  );
}
