import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Paper,
} from '@mui/material';
import React from 'react';

/** @jsxImportSource react */

export default function PortfolioPerformance() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Portfolio Performance
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="h6">Total Value</Typography>
              <Typography variant="h4" fontWeight="bold">
                $120,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="h6">Total Gain</Typography>
              <Typography variant="h4" fontWeight="bold">
                $8,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance Over Time
        </Typography>
        {/* Insert chart component here, e.g., Recharts or Chart.js */}
        <Box sx={{ height: 250, backgroundColor: '#f5f5f5' }} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Asset Allocation
        </Typography>
        {/* Insert pie chart or breakdown component here */}
        <Box sx={{ height: 250, backgroundColor: '#f5f5f5' }} />
      </Paper>
    </Container>
  );
}
