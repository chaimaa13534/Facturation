import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export const ModernCard = ({ 
  children, 
  title, 
  subtitle,
  icon,
  action,
  variant = 'elevated',
  hover = true,
  padding = 3,
  ...props 
}) => {
  return (
    <Paper
      elevation={variant === 'elevated' ? 1 : 0}
      sx={{
        p: padding,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...(hover && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
            borderColor: 'primary.main',
          },
        }),
      }}
      {...props}
    >
      {/* Header */}
      {(title || icon || action) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: subtitle || title ? 2 : 0,
            pb: subtitle || title ? 2 : 0,
            borderBottom: (subtitle || title) ? '1px solid' : 'none',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                }}
              >
                {icon}
              </Box>
            )}
            {(title || subtitle) && (
              <Box>
                {title && (
                  <Typography variant="h6" component="h3" sx={{ mb: 0.5 }}>
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
          {action && (
            <Box sx={{ ml: 2 }}>
              {action}
            </Box>
          )}
        </Box>
      )}

   
      {children}
    </Paper>
  );
};

export default ModernCard;
