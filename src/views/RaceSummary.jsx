import React from 'react';
import { Paper, Typography, Divider } from '@mui/material';
import nutrients from '../components/nutrients'; // Adjust the path as necessary

const RaceSummary = ({ gridRowData }) => {
    const calculateSummary = () => {
        let summary = {};

        // Initialize summary values for each nutrient
        nutrients.forEach(nutrient => {
            summary[nutrient] = {
                total: 0,
                min: Infinity,
                max: -Infinity,
                avg: 0
            };
        });

        let intervalsWithData = 0;

        gridRowData.forEach(row => {
            intervalsWithData++;
            if (row.fuelDetails.length > 0) {
                nutrients.forEach(nutrient => {
                    let rowTotal = 0;

                    row.fuelDetails.forEach(fuel => {
                        rowTotal += fuel[nutrient] * (fuel.count || 1); // Assuming each fuel item has the nutrient properties
                    });

                    summary[nutrient].total += rowTotal;
                    summary[nutrient].min = Math.min(summary[nutrient].min, rowTotal);
                    summary[nutrient].max = Math.max(summary[nutrient].max, rowTotal);
                });
            }
        });

        // Calculate averages
        nutrients.forEach(nutrient => {
            summary[nutrient].avg = intervalsWithData > 0 ? summary[nutrient].total / intervalsWithData : 0;
        });

        return summary;
    };

    const summary = calculateSummary();

    return (
        <Paper elevation={3} style={{ padding: '16px', margin: '16px' }}>
            <Typography variant="h4">Nutritional Summary</Typography>
            {nutrients.map(nutrient => (
                <div key={nutrient}>
                    <Divider sx={{m: 1}}/>
                    <Typography variant="h5">{`${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}`}</Typography>
                    <Typography>Min: {summary[nutrient].min === Infinity ? "N/A" : summary[nutrient].min}</Typography>
                    <Typography>Max: {summary[nutrient].max === -Infinity ? "N/A" : summary[nutrient].max}</Typography>
                    <Typography>Avg: {summary[nutrient].avg.toFixed(2)}</Typography>
                    <Typography>Total: {summary[nutrient].total}</Typography>
                </div>
            ))}
        </Paper>
    );
};

export default RaceSummary;