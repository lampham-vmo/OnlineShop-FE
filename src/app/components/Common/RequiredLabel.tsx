import { Typography } from '@mui/material';

interface IRequiredLabelProps {
  label: string;
}

const RequiredLabel = ({ label }: IRequiredLabelProps) => {
  return (
    <>
      {label}{' '}
      <Typography component="span" color="error">
        *
      </Typography>
    </>
  );
};

export default RequiredLabel;
