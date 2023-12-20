import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, IconButton } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const FuelSelectDialog = ({ open, onClose, fuelData, selectedFuels, setSelectedFuels }) => {
    const handleSelectFuel = (fuel) => {
        const existingFuel = selectedFuels.find(f => f.name === fuel.name);
        if (existingFuel) {
            setSelectedFuels(selectedFuels.map(f =>
                f.name === fuel.name ? { ...f, count: f.count + 1 } : f
            ));
        } else {
            setSelectedFuels([...selectedFuels, { ...fuel, count: 1 }]);
        }
    };

    const handleRemoveFuel = (fuelName) => {
        setSelectedFuels(selectedFuels.reduce((acc, f) => {
            if (f.name === fuelName) {
                if (f.count > 1) {
                    acc.push({ ...f, count: f.count - 1 });
                }
            } else {
                acc.push(f);
            }
            return acc;
        }, []));
    };

    return (
        <Dialog open={open} onClose={onClose} sx={{ borderRadius: 2 }}>
            <DialogTitle>Select Fuels</DialogTitle>
            <DialogContent>
                <div style={{ marginBottom: 16 }}>
                    {selectedFuels.map((fuel) => (
                        <Chip
                            key={fuel.name}
                            label={`${fuel.name} (x${fuel.count})`}
                            onDelete={() => handleRemoveFuel(fuel.name)}
                            deleteIcon={<RemoveCircleOutlineIcon />}
                            color="primary"
                            style={{ margin: 2 }}
                        />
                    ))}
                </div>
                {fuelData.filter(fuel => fuel.name).map((fuel) => (
                    <Chip
                        key={fuel.name}
                        label={fuel.name}
                        onClick={() => handleSelectFuel(fuel)}
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