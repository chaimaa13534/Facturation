import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';
import {
  CheckCircleOutlined,
  ErrorOutlined,
  WarningAmberOutlined,
  InfoOutlined,
} from '@mui/icons-material';

export const ModernAlert = ({
  title,
  message,
  type = 'info',
  icon: CustomIcon,
  action,
  closable = false,
  onClose,
  ...props
}) => {
  const alertTypes = {
    success: { variant: 'filled', severity: 'success', icon: CheckCircleOutlined },
    error: { variant: 'filled', severity: 'error', icon: ErrorOutlined },
    warning: { variant: 'filled', severity: 'warning', icon: WarningAmberOutlined },
    info: { variant: 'filled', severity: 'info', icon: InfoOutlined },
  };

  const config = alertTypes[type] || alertTypes.info;
  const IconComponent = CustomIcon || config.icon;

  return (
    <Alert
      severity={config.severity}
      variant={config.variant}
      icon={<IconComponent />}
      onClose={closable ? onClose : undefined}
      sx={{
        borderRadius: 1.5,
        mb: 2,
        fontSize: 'body2.fontSize',
        fontWeight: 500,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        '& .MuiAlert-icon': {
          fontSize: '24px',
        },
      }}
      {...props}
    >
      <Box>
        {title && <AlertTitle sx={{ fontWeight: 700, mb: 0.5 }}>{title}</AlertTitle>}
        {message}
      </Box>
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Alert>
  );
};

export default ModernAlert;
