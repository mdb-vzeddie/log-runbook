import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { Typography, Button } from '@mui/material';

const FuelManagementView = ({ onFuelDataChange }) => {
    const [gridApi, setGridApi] = useState(null);
    const [rowData, setRowData] = useState([]);

    const fuelColumnDefs = [
        { headerName: "Name", field: "name", editable: true },
        { headerName: "Type", field: "type", editable: true },
        { headerName: "Calories", field: "calories", editable: true },
        { headerName: "Fat", field: "fat", editable: true },
        { headerName: "Sodium", field: "sodium", editable: true },
        { headerName: "Caffeine", field: "caffeine", editable: true },
    ];

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const addFuelItem = () => {
        const newItem = { name: '', type: '', calories: 0, fat: 0, sodium: 0, caffeine: 0 };
        setRowData([...rowData, newItem]);
    };

    const onCellValueChanged = () => {
        if (gridApi) {
            const updatedRowData = [];
            gridApi.forEachNode(node => updatedRowData.push(node.data));
            setRowData(updatedRowData);
            onFuelDataChange(updatedRowData); // Update parent component
        }
    };

    return (
        <div className="ag-theme-alpine-dark" style={{ height: '50vh', width: '50%' }}>
            <Typography variant="h5" sx={{m: 2}}>Fuel Management</Typography>
            <AgGridReact
                columnDefs={fuelColumnDefs}
                onGridReady={onGridReady}
                onCellValueChanged={onCellValueChanged}
                rowData={rowData}
                animateRows={true}
            />
            <Button variant="contained" onClick={addFuelItem}>Add Fuel Item</Button>
        </div>
    );
};

export default FuelManagementView;