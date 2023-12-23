import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { Grid, Typography, Button, Box } from '@mui/material';
import nutrients from '../components/nutrients';
import Papa from 'papaparse';

const FuelManagementView = ({ onFuelDataChange }) => {
    const [gridApi, setGridApi] = useState(null);
    const [rowData, setRowData] = useState([]);

    // Dynamically generate column definitions
    const fuelColumnDefs = [
        { headerName: '', field: 'checkboxBtn', checkboxSelection: true, headerCheckboxSelection: true, pinned: 'left', width: 50 },
        { headerName: "Name", field: "name", editable: true, width: 300 },
        ...nutrients.map(nutrient => ({
            headerName: nutrient.charAt(0).toUpperCase() + nutrient.slice(1),
            field: nutrient,
            editable: true,
            width: 100
        })),
    ];

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const exportFuelData = () => {
        if (gridApi) {
            gridApi.exportDataAsCsv();
        }
    };

    // Load data from local storage when component mounts
    useEffect(() => {
        const savedRowData = localStorage.getItem('fuelData');
        if (savedRowData) {
            setRowData(JSON.parse(savedRowData));
        }
    }, []);

    // Save rowData to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('fuelData', JSON.stringify(rowData));
    }, [rowData]);


    const addFuelItem = () => {
        if (rowData.length === 0 || rowData[rowData.length - 1].name !== '') {
            // Initialize new item with default values for each nutrient
            const newItem = { name: '' };
            nutrients.forEach(nutrient => {
                newItem[nutrient] = 0;
            });

            setRowData([...rowData, newItem]);
        }
        else {
            console.error("Will not add new fuel item if previous fuel has an empty name")
        }
    };

    const onCellValueChanged = () => {
        if (gridApi) {
            const updatedRowData = [];
            gridApi.forEachNode(node => updatedRowData.push(node.data));
            setRowData(updatedRowData);
            onFuelDataChange(updatedRowData); // Update parent component
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    const parsedData = results.data.map(row => {
                        let newRow = {};
                        // Map CSV headers to field names
                        newRow["name"] = row["Name"] || '';
                        nutrients.forEach(nutrient => {
                            const nutrientCapitalized = nutrient.charAt(0).toUpperCase() + nutrient.slice(1);
                            newRow[nutrient] = parseFloat(row[nutrientCapitalized]) || 0;
                        });
                        return newRow;
                    });
                    setRowData(parsedData);
                }
            });
        }
    };

    const handleDeleteSelected = () => {
        const selectedRows = gridApi.getSelectedRows();
        gridApi.applyTransaction({ remove: selectedRows });

        // Update rowData state after deletion
        const updatedRowData = rowData.filter(row => !selectedRows.includes(row));
        setRowData(updatedRowData);
        onFuelDataChange(updatedRowData); // Update parent component if needed
    };

    return (
        <Box className="ag-theme-alpine-dark" sx={{ height: '50vh', mb: 10 }}>
            <Typography variant="h5" sx={{ m: 2 }}>Fuel Management</Typography>
            <AgGridReact
                columnDefs={fuelColumnDefs}
                onGridReady={onGridReady}
                onCellValueChanged={onCellValueChanged}
                rowData={rowData}
                animateRows={true}
                singleClickEdit
                stopEditingWhenCellsLoseFocus
                rowSelection='multiple'
            />
            <Grid container sx={{ mt: 2 }} spacing={2}>
                <Grid item sm={3}>
                    <Button variant="contained" onClick={addFuelItem} >Add Fuel Item</Button>
                </Grid>
                <Grid item sm={3}>
                    <Button variant="contained" onClick={handleDeleteSelected}
                    >Delete Selected Fuel</Button>
                </Grid>
                <Grid item sm={3}>
                    <Button variant="contained" onClick={exportFuelData} >Export Fuel Data</Button>
                </Grid>
                <Grid item sm={3}>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        id="fuelManagementFileUpload"
                    />
                    <label htmlFor="fuelManagementFileUpload">
                        <Button variant="contained" component="span" >
                            Import Fuel Data
                        </Button>
                    </label>
                </Grid>
            </Grid>
        </Box>

    );
};

export default FuelManagementView;
