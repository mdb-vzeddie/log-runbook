// MainSheetView.jsx
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { Typography, Button } from '@mui/material';
import FuelSelectDialog from '../components/FuelSelectDialog';
import nutrients from '../components/nutrients';

const MainSheetView = ({ runDetails, fuelData, gridRowData, setGridRowData }) => {
    const [openFuelDialog, setOpenFuelDialog] = useState(false);
    const [currentRowIndex, setCurrentRowIndex] = useState(null);
    const [selectedFuels, setSelectedFuels] = useState([]);
    const [raceTimeInMinutes, setRaceTimeInMinutes] = useState(0);
    const [gridApi, setGridApi] = useState(null);

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
        if (runDetails && gridRowData.length === 0) {
            const { distance, interval, metric } = runDetails;
            const numberOfIntervals = distance / interval;
            const isDistanceMetric = metric === 'km' || metric === 'miles';

            if (isDistanceMetric) {
                // Function to create a row with default nutrient values
                const createDistanceRow = (intervalDistance, index, customRow) => {
                    const kmValue = metric === 'km' ? intervalDistance.toFixed(2) : (intervalDistance * 1.60934).toFixed(2);
                    const milesValue = metric === 'miles' ? intervalDistance.toFixed(2) : (intervalDistance * 0.621371).toFixed(2);

                    return {
                        intervalKm: customRow ? customRow : kmValue,
                        intervalMi: customRow ? customRow : milesValue,
                        fuel: '',
                        fuelDetails: [],
                        ...Object.fromEntries(nutrients.map(nutrient => [nutrient, 0]))
                    };
                };

                const raceStartRow = [createDistanceRow(0, null, "Race Start")];
                const rows = Array.from({ length: numberOfIntervals }, (_, index) => {
                    return createDistanceRow((index + 1) * interval, index);
                });
                const raceEndRow = [createDistanceRow(0, null, "Race End")];

                setGridRowData([...raceStartRow, ...rows, ...raceEndRow]);
            }
            else {
                const raceStartRow = [{
                    hours: "Race Start",
                    minutes: "Race Start",
                    fuel: '',
                    fuelDetails: [],
                    ...Object.fromEntries(nutrients.map(nutrient => [nutrient, 0]))
                }];
                const raceEndRow = [{
                    hours: "Race End",
                    minutes: "Race End",
                    fuel: '',
                    fuelDetails: [],
                    ...Object.fromEntries(nutrients.map(nutrient => [nutrient, 0]))
                }];

                setGridRowData([...raceStartRow, ...raceEndRow]);
            }
        }
    }, [runDetails, gridRowData]);

    const getRowHeight = (params) => {
        if (params.data && params.data.fuel) {
            const lineBreaks = params.data.fuel.match(/\n/g) || [];
            return 40 + (lineBreaks.length * 20);
        }
        return 40;
    }

    const getColumnsBasedOnMetric = (metric) => {
        const columnDef = [];
        if (metric === 'miles' || metric === 'km') {
            columnDef.push(
                {
                    headerName: "Interval (km)",
                    field: "intervalKm",
                    editable: false,
                    width: 125
                }
            )
            columnDef.push(
                {
                    headerName: "Interval (mi)",
                    field: "intervalMi",
                    editable: false,
                    width: 125
                }
            )
            if (metric === 'miles') {
                columnDef.reverse()
            }
        }
        else {
            columnDef.push(
                {
                    headerName: "Hours",
                    field: "hours",
                    editable: false,
                    width: 125
                }
            );
            columnDef.push(
                {
                    headerName: "Minutes",
                    field: "minutes",
                    editable: false,
                    width: 125
                }
            )
        }
        columnDef.push(
            {
                headerName: "Fuel",
                field: "fuel",
                cellStyle: { 'whiteSpace': 'pre-wrap', 'lineHeight': '1.5' },
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

    function convertMinutesToHHMM(minutes) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
    }

    // Function to add new interval row for time-based metrics
    const addTimeIntervalRow = () => {
        if (!runDetails || runDetails.metric === 'km' || runDetails.metric === 'miles') return;

        // Convert interval to integer
        const intervalMinutes = parseInt(runDetails.interval, 10);
        if (isNaN(intervalMinutes)) {
            console.error('Interval is not a number');
            return;
        }

        // Calculate new race time in minutes
        let newRaceTimeInMinutes = raceTimeInMinutes;
        if (runDetails.metric === "hours") {
            newRaceTimeInMinutes += intervalMinutes * 60;
        } else if (runDetails.metric === "minutes") {
            newRaceTimeInMinutes += intervalMinutes;
        }

        const newInterval = {
            hours: convertMinutesToHHMM(newRaceTimeInMinutes),
            minutes: newRaceTimeInMinutes,
            fuel: '',
            fuelDetails: [],
            ...Object.fromEntries(nutrients.map(nutrient => [nutrient, 0]))
        };

        setRaceTimeInMinutes(newRaceTimeInMinutes)
        setGridRowData(prevGridRowData => [...prevGridRowData.slice(0, -1), newInterval, prevGridRowData[prevGridRowData.length - 1]]);
    };

    const handleExport = () => {
        if (gridApi) {
            gridApi.exportDataAsCsv();
        }
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h3">{runDetails.runName} ({
                    runDetails.metric === "km" ? `${runDetails.distance} KM` :
                        runDetails.metric === "miles" ? `${runDetails.distance} Mi` :
                            runDetails.metric === "hours" || runDetails.metric === "minutes" ? `${runDetails.interval} ${runDetails.metric.slice(0, -1)} intervals` : ''})</Typography>
                {runDetails && runDetails.metric !== 'km' && runDetails.metric !== 'miles' && (
                    <Button onClick={addTimeIntervalRow} variant="contained" style={{ marginLeft: 'auto' }}>
                        Add Time Interval
                    </Button>
                )}
                <Button onClick={handleExport} variant="contained" style={{ marginLeft: 'auto' }}>
                    Export as CSV
                </Button>
            </div>
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