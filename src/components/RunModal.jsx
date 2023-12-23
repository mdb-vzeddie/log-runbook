import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, MenuItem, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 4 
};

const RunModal = ({ open, handleClose, onSubmit }) => {
    const [runName, setRunName] = useState('');
    const [distance, setDistance] = useState('');
    const [metric, setMetric] = useState('km');
    const [interval, setInterval] = useState('');

    const handleSubmit = () => {
        onSubmit({ runName, distance, metric, interval });
    };

    const isDistanceMetric = metric === "km" || metric === "miles";

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="run-modal-title"
        >
            <Box sx={style}>
                <Typography id="run-modal-title" variant="h6" component="h2" color="primary">
                    Welcome to the Run Logbook!
                </Typography>
                <TextField
                    label="Run Name"
                    fullWidth
                    margin="normal"
                    value={runName}
                    onChange={(e) => setRunName(e.target.value)}
                />
                <TextField
                    label="Metric"
                    fullWidth
                    select
                    margin="normal"
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                >
                    <MenuItem value="km">Kilometers</MenuItem>
                    <MenuItem value="miles">Miles</MenuItem>
                    <MenuItem value="hours">Hours</MenuItem>
                    <MenuItem value="minutes">Minutes</MenuItem>
                </TextField>
                { isDistanceMetric && (
                <TextField
                    label="Distance"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                />
                )}
                <TextField
                    label="Interval"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={handleSubmit}
                    sx={{mt: 4}}
                >
                    Start My Logbook
                </Button>
            </Box>
        </Modal>
    );
};

export default RunModal;