import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';

export const ModernButton = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  icon: Icon,
  iconPosition = 'start',
  fullWidth = false,
  disabled = false,
  onClick,
  ...props
}) => {
  const sizeMap = {
    small: { padding: '6px 12px', fontSize: '0.85rem' },
    medium: { padding: '10px 20px', fontSize: '0.95rem' },
    large: { padding: '14px 28px', fontSize: '1rem' },
  };

  const btnSize = sizeMap[size];

  return (
    <Button
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '10px',
        padding: btnSize.padding,
        fontSize: btnSize.fontSize,
        letterSpacing: '0.5px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'visible',
        ...(variant === 'contained' && {
          background: `linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
            ...(!disabled && {
              background: 'linear-gradient(135deg, var(--accent-dark) 0%, #1d4ed8 100%)',
            }),
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }),
        ...(variant === 'outlined' && {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        }),
      }}
      {...props}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {loading && (
          <CircularProgress
            size={18}
            sx={{
              color: variant === 'contained' ? 'inherit' : 'primary.main',
            }}
          />
        )}
        {Icon && iconPosition === 'start' && !loading && <Icon />}
        {children}
        {Icon && iconPosition === 'end' && !loading && <Icon />}
      </Box>
    </Button>
  );
};

export default ModernButton;
