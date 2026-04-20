import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

/**
 * Composant KPI Cards pour afficher les métriques clés
 */
export const KPICard = ({ 
  title, 
  value, 
  unit = '',
  icon: Icon,
  change,
  color = 'primary',
  trend = 'up',
  ...props 
}) => {
  const colorMap = {
    primary: { bg: '#dbeafe', icon: '#3b82f6' },
    success: { bg: '#dcfce7', icon: '#10b981' },
    warning: { bg: '#fef3c7', icon: '#f59e0b' },
    error: { bg: '#fee2e2', icon: '#ef4444' },
    secondary: { bg: '#cffafe', icon: '#06b6d4' },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
          borderColor: colors.icon,
        },
      }}
      {...props}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                }}
              >
                {value}
              </Typography>
              {unit && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#64748b',
                    fontWeight: 500,
                  }}
                >
                  {unit}
                </Typography>
              )}
            </Box>
            {change && (
              <Typography
                variant="caption"
                sx={{
                  color: trend === 'up' ? '#10b981' : '#ef4444',
                  fontWeight: 600,
                  mt: 1,
                  display: 'block',
                }}
              >
                {trend === 'up' ? '↑' : '↓'} {change}
              </Typography>
            )}
          </Box>
          {Icon && (
            <Box
              sx={{
                backgroundColor: colors.bg,
                color: colors.icon,
                p: 1.5,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              <Icon />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default KPICard;
