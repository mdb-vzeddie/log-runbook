import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { Typography, Button } from '@mui/material';
import nutrients from '../components/nutrients';

const FuelManagementView = ({ onFuelDataChange }) => {
    const [gridApi, setGridApi] = useState(null);
    const [rowData, setRowData] = useState([]);

    // Dynamically generate column definitions
    const fuelColumnDefs = [
        { headerName: "Name", field: "name", editable: true, width: 300 },
        ...nutrients.map(nutrient => ({
            headerName: nutrient.charAt(0).toUpperCase() + nutrient.slice(1),
            field: nutrient,
            editable: true,
            width: 100
        }))
    ];

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const addFuelItem = () => {
        // Initialize new item with default values for each nutrient
        const newItem = { name: '' };
        nutrients.forEach(nutrient => {
            newItem[nutrient] = 0;
        });

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
        <div className="ag-theme-alpine-dark" style={{ height: '50vh' }}>
            <Typography variant="h5" sx={{m: 2}}>Fuel Management</Typography>
            <AgGridReact
                columnDefs={fuelColumnDefs}
                onGridReady={onGridReady}
                onCellValueChanged={onCellValueChanged}
                rowData={rowData}
                animateRows={true}
            />
            <Button variant="contained" onClick={addFuelItem} sx={{mt: 2}}>Add Fuel Item</Button>
        </div>
    );
};

export default FuelManagementView;