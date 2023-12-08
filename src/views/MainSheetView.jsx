// MainSheetView.jsx
import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { Typography } from '@mui/material';

const MainSheetView = ({ runDetails, fuelData }) => {
    const mainSheetColumnDefs = [
        // ... other column definitions ...
        { 
            headerName: "Fuel", 
            field: "fuel", 
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: fuelData.map(fuel => fuel.name)
            },
            editable: true 
        },
        // ... other column definitions ...
    ];

    return (
        <div className="ag-theme-alpine-dark" style={{ height: '50vh', width: '100%', marginBottom: '6.5em' }}>
            <Typography variant="h2">{runDetails.runName}</Typography>
            <AgGridReact
                columnDefs={mainSheetColumnDefs}
                rowData={[]}
                animateRows={true}
            />
        </div>
    );
};

export default MainSheetView;