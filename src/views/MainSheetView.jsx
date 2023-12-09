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
    const [gridApi, setGridApi] = useState(null);

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
            const { distance, interval, metric } = runDetails;
            const numberOfIntervals = distance / interval;
            const raceStartRow = [{
                intervalKm: "Race Start",
                intervalMiles: "Race Start",
                fuel: '',
                calories: 0,
                fat: 0,
                sodium: 0,
                caffeine: 0
            }]
            const rows = Array.from({ length: numberOfIntervals }, (_, index) => {
                const intervalDistance = (index + 1) * interval;
                const row = {
                    intervalKm: metric === 'km' ? intervalDistance.toFixed(2) : null,
                    intervalMiles: metric === 'miles' ? (intervalDistance * 0.621371).toFixed(2) : null,
                    fuel: '',
                    calories: 0,
                    fat: 0,
                    sodium: 0,
                    caffeine: 0
                };
                return row;
            });
        setGridRowData([...raceStartRow, ...rows]);
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

    const getColumnsBasedOnMetric = (metric) => {
        const columnDef = [
            {
                headerName: "Interval (km)",
                field: "intervalKm",
                editable: false,
                width: 125
            },
            {
                headerName: "Interval (mi)",
                field: "intervalMi",
                editable: false,
                width: 125
            },
        ]
        if (metric === 'miles') {
            columnDef.reverse()
        }
        const otherColumns = [
            { 
                headerName: "Fuel", 
                field: "fuel", 
                cellStyle: {'whiteSpace': 'pre-wrap', 'lineHeight': '1.5'},
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                    values: fuelData.map(fuel => fuel.name)
                },
                editable: true,
                width: 300
            },
            {
                headerName: "Calories",
                field: "calories",
                editable: false,
                width: 125
            },
            {
                headerName: "Fat",
                field: "fat",
                editable: false,
                width: 125
            },
            {
                headerName: "Sodium",
                field: "sodium",
                editable: false,
                width: 125
            },
            {
                headerName: "Caffeine",
                field: "caffeine",
                editable: false,
                width: 125
            },
            {
                headerName: "Temp",
                field: "temp",
                editable: true,
                width: 125
            },
            {
                headerName: "Time",
                field: "time",
                editable: true,
                width: 125
            },
            {
                headerName: "Notes",
                field: "notes",
                editable: true,
                width: 400
            }
        ];
        return [...columnDef, ...otherColumns];
    }

    return (
        <>
        <Typography variant="h3">{runDetails.runName}</Typography>
            <div className="ag-theme-alpine-dark" style={{ height: '50vh', width: '100%' }}>
                <AgGridReact
                    columnDefs={getColumnsBasedOnMetric(runDetails.metric)}
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
