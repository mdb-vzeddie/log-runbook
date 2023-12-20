import React, { useState } from 'react';
import RunModal from './components/RunModal';
import MainSheetView from './views/MainSheetView';
import FuelManagementView from './views/FuelManagementView';
import RaceSummary from './views/RaceSummary';
import { Grid } from '@mui/material';

const App = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [runDetails, setRunDetails] = useState(null);
  const [fuelData, setFuelData] = useState([]);
  const [gridRowData, setGridRowData] = useState([]);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  // This function is triggered when the modal form is submitted
  const handleModalSubmit = (details) => {
    setRunDetails(details);
    setModalSubmitted(true);
    handleClose();
  };

  // This function is triggered when fuel data changes
  const handleFuelDataChange = (newFuelData) => {
    setFuelData(newFuelData);
  };

  const updateAppGridRowData = (newData) => {
    setGridRowData(newData);
  };

  return (
    <div>
      <RunModal open={modalOpen} onSubmit={handleModalSubmit} handleClose={handleClose} />

      {modalSubmitted && (
        <>
          <MainSheetView runDetails={runDetails} fuelData={fuelData} updateAppGridRowData={updateAppGridRowData} />
                    <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FuelManagementView onFuelDataChange={handleFuelDataChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RaceSummary gridRowData={gridRowData} runDetails={runDetails} />
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default App;