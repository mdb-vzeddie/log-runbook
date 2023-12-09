// FuelSelectDialog.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip } from '@mui/material';

const FuelSelectDialog = ({ open, onClose, fuelData, selectedFuels, setSelectedFuels }) => {
    const handleSelectFuel = (fuel) => {
        if (selectedFuels.includes(fuel)) {
            setSelectedFuels(selectedFuels.filter(f => f !== fuel));
        } else {
            setSelectedFuels([...selectedFuels, fuel]);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} sx={{borderRadius: 2}}>
            <DialogTitle>Select Fuels</DialogTitle>
            <DialogContent>
                {fuelData.filter(fuel => fuel.name).map((fuel) => (
    <Chip
        key={fuel.name}
        label={fuel.name}
        onClick={() => handleSelectFuel(fuel)}
        color={selectedFuels.includes(fuel) ? 'primary' : 'default'}
        style={{ margin: 2 }}
    />
))}


            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Done</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FuelSelectDialog;