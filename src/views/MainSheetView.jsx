// MainSheetView.jsx
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { Typography } from '@mui/material';
import FuelSelectDialog from '../components/FuelSelectDialog';
import nutrients from '../components/nutrients';

const MainSheetView = ({ runDetails, fuelData, updateAppGridRowData, setGridApi }) => {
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
            setSelectedFuels(params.data.fuelDetails || []);
            setOpenFuelDialog(true);
        }
    };

    const handleCloseFuelDialog = () => {
        setOpenFuelDialog(false);
        const updatedRows = [...gridRowData];
        const nutrientTotals = {};

        // Initialize nutrient totals
        nutrients.forEach(nutrient => {
            nutrientTotals[nutrient] = selectedFuels.reduce((total, fuel) => {
                return total + (fuel[nutrient] || 0) * (fuel.count || 1);
            }, 0);
        });

        updatedRows[currentRowIndex] = {
            ...updatedRows[currentRowIndex],
            fuel: selectedFuels.map(fuel => `${fuel.name} (x${fuel.count})`).join('\n'),
            fuelDetails: selectedFuels,
            ...nutrientTotals
        };

        setGridRowData(updatedRows);
        updateAppGridRowData(updatedRows);
    };

    useEffect(() => {
    if (runDetails) {
        const { distance, interval, metric } = runDetails;
        const numberOfIntervals = distance / interval;

        // Function to create a row with default nutrient values
        const createRow = (intervalDistance, index, customRow) => {
            const kmValue = metric === 'km' ? intervalDistance.toFixed(2) : (intervalDistance * 1.60934).toFixed(2);
            const milesValue = metric === 'miles' ? intervalDistance.toFixed(2) : (intervalDistance * 0.621371).toFixed(2);

            return {
                intervalKm: customRow ? customRow : kmValue,
                intervalMi: customRow ? customRow: milesValue,
                fuel: '',
                fuelDetails: [],
                ...Object.fromEntries(nutrients.map(nutrient => [nutrient, 0]))
            };
        };

        const raceStartRow = [createRow(0, null, "Race Start")];
        const rows = Array.from({ length: numberOfIntervals }, (_, index) => {
            return createRow((index + 1) * interval, index);
        });
        const raceEndRow = [createRow(0, null, "Race End")];

        setGridRowData([...raceStartRow, ...rows, ...raceEndRow]);
    }
}, [runDetails]);

    console.log(gridRowData)


    const getRowHeight = (params) => {
        if (params.data && params.data.fuel) {
            const lineBreaks = params.data.fuel.match(/\n/g) || [];
            return 40 + (lineBreaks.length * 20);
        }
        return 40;
    }
 
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
        columnDef.push(
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
            }
        )
        nutrients.map(nutrient => columnDef.push(
            {
                headerName: nutrient.charAt(0).toUpperCase() + nutrient.slice(1),
                field: nutrient,
                editable: false,
                width: 125
            }
        ))
        const otherColumns = [
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