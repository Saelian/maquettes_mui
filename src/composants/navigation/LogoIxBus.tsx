import { Box } from '@mui/material';

/**
 * Logo iXBus affiché dans le menu latéral
 */
export default function LogoIxBus() {
  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          bgcolor: '#F5A623',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: 'white',
          fontSize: '1.2rem',
        }}
      >
        iX
      </Box>
    </Box>
  );
}
