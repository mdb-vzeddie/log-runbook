// MainSheetView.jsx
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { Typography } from '@mui/material';
import FuelSelectDialog from '../components/FuelSelectDialog';

const MainSheetView = ({ runDetails, fuelData }) => {
    const [gridRowData, setGridRowData] = useState([]);
    const [openFuelDialog, setOpenFuelDialog] = useState(false);
    const [currentRowIndex, setCurrentRowIndex] = useState(null);
    const [selectedFuels, setSelectedFuels] = useState([]);

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const handleCellClicked = (params) => {
        if (params.colDef.field === 'fuel') {
            setCurrentRowIndex(params.rowIndex);
            setSelectedFuels(params.data.fuel || []);
            setOpenFuelDialog(true);
        }
    };

    const handleCloseFuelDialog = () => {
        setOpenFuelDialog(false);
        const updatedRows = [...gridRowData];
        updatedRows[currentRowIndex] = {
            ...updatedRows[currentRowIndex],
            fuel: selectedFuels.map(fuel => fuel.name).join('\n'),
            calories: selectedFuels.reduce((totalCalories, fuel) => {
                const calories = fuel.calories;
                return typeof calories === 'number' && !isNaN(calories) ? totalCalories + calories : totalCalories;
            }, 0),
            fat: selectedFuels.reduce((totalFat, fuel) => {
                const fat = fuel.fat;
                return typeof fat === 'number' && !isNaN(fat) ? totalFat + fat : totalFat;
            }, 0),
            sodium: selectedFuels.reduce((totalSodium, fuel) => {
                const sodium = fuel.sodium;
                return typeof sodium === 'number' && !isNaN(sodium) ? totalSodium + sodium : totalSodium;
            }, 0),
            caffeine: selectedFuels.reduce((totalCaffeine, fuel) => {
                const caffeine = fuel.caffeine;
                return typeof caffeine === 'number' && !isNaN(caffeine) ? totalCaffeine + caffeine : totalCaffeine;
            }, 0),
        };
        setGridRowData(updatedRows);
    };

    useEffect(() => {
        if (runDetails) {
            const { distance, interval } = runDetails;
            const numberOfIntervals = distance / interval;
            const rows = Array.from({ length: numberOfIntervals }, (_, index) => ({
                interval: (index + 1) * interval,
                fuel: '',
                calories: 0,
                fat: 0,
                sodium: 0,
                caffeine: 0
            }));
            setGridRowData(rows);
        }
    }, [runDetails]);

    const getRowHeight = (params) => {
        if (params.data && params.data.fuel) {
            // Estimate row height based on the number of line breaks
            const lineBreaks = params.data.fuel.match(/\n/g) || [];
            return 40 + (lineBreaks.length * 20); // Adjust these values as needed
        }
        return 40; // Default row height
    };

    const mainSheetColumnDefs = [
        { 
            headerName: "Interval", 
            field: "interval",
            editable: false
        },
        { 
            headerName: "Fuel", 
            field: "fuel", 
            cellStyle: {'white-space': 'pre-wrap', 'line-height': '1.5'},
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: fuelData.map(fuel => fuel.name)
            },
            editable: true 
        },
        {
            headerName: "Calories",
            field: "calories",
            editable: false
        },
        {
            headerName: "Fat",
            field: "fat",
            editable: false
        },
        {
            headerName: "Sodium",
            field: "sodium",
            editable: false
        },
        {
            headerName: "Caffeine",
            field: "caffeine",
            editable: false
        },
    ];

    return (
        <>
        <Typography variant="h3">{runDetails.runName}</Typography>
            <div className="ag-theme-alpine-dark" style={{ height: '50vh', width: '100%' }}>
                <AgGridReact
                    columnDefs={mainSheetColumnDefs}
                    onGridReady={onGridReady}
                    rowData={gridRowData}
                    onCellClicked={handleCellClicked}
                    getRowHeight={getRowHeight}
                    animateRows={true}
                />
            </div>
            <FuelSelectDialog
                open={openFuelDialog}
                onClose={handleCloseFuelDialog}
                fuelData={fuelData}
                selectedFuels={selectedFuels}
                setSelectedFuels={setSelectedFuels}
            />
        </>
    );
};

export default MainSheetView;
