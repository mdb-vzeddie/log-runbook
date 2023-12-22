import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { Typography, Button } from '@mui/material';
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

    return (
        <div className="ag-theme-alpine-dark" style={{ height: '50vh' }}>
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
            <Button variant="contained" onClick={addFuelItem} sx={{ mt: 2 }}>Add Fuel Item</Button>
            <Button variant="contained" onClick={_ => {
                const selectedRows = gridApi.getSelectedRows();
                gridApi.applyTransaction({ remove: selectedRows });
            }}
            sx={{ ml: 2, mt: 2 }}>Delete Selected Fuel</Button>
            <Button variant="contained" onClick={exportFuelData} sx={{ ml: 2, mt: 2 }}>Export Fuel Data</Button>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="fuelManagementFileUpload"
            />
            <label htmlFor="fuelManagementFileUpload">
                <Button variant="contained" component="span" sx={{ ml: 2, mt: 2 }}>
                    Import Fuel Data
                </Button>
            </label>
        </div>
    );
};

export default FuelManagementView;
