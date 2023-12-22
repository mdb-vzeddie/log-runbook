import React, { useState, useEffect } from 'react';
import RunModal from './components/RunModal';
import MainSheetView from './views/MainSheetView';
import FuelManagementView from './views/FuelManagementView';
import RaceSummary from './views/RaceSummary';
import { Grid, Button, Modal, Box, Typography } from '@mui/material';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [runDetails, setRunDetails] = useState(null);
  const [fuelData, setFuelData] = useState([]);
  const [gridRowData, setGridRowData] = useState([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);


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

  const handleNewRace = () => {
    // Clear local storage
    localStorage.clear();

    // Reset state
    setRunDetails(null);
    setFuelData([]);
    setGridRowData([]);
    setModalSubmitted(false);

    // Open the run details modal
    setModalOpen(true);

    // Close the confirmation modal
    setShowConfirmModal(false);
  };

  useEffect(() => {
    if (isInitialLoadComplete && !modalSubmitted) {
      handleOpen();
    }
  }, [isInitialLoadComplete, modalSubmitted])

  useEffect(() => {
    // Load gridRowData and fuelData from local storage
    const savedGridRowData = localStorage.getItem('gridRowData');
    const savedFuelData = localStorage.getItem('fuelData');
    const savedRunDetails = localStorage.getItem('runDetails');

    if (savedGridRowData) {
      setGridRowData(JSON.parse(savedGridRowData));
      setModalOpen(false);
      setModalSubmitted(true);
    }
    if (savedFuelData) {
      setFuelData(JSON.parse(savedFuelData));
      setModalOpen(false);
      setModalSubmitted(true);
    }
    if (savedRunDetails) {
      setRunDetails(JSON.parse(savedRunDetails));
      setModalOpen(false);
      setModalSubmitted(true);
    }

    setIsInitialLoadComplete(true);

  }, []);

  useEffect(() => {
    if (isInitialLoadComplete && gridRowData) {
      localStorage.setItem('gridRowData', JSON.stringify(gridRowData));
    }
  }, [gridRowData, isInitialLoadComplete]);

  useEffect(() => {
    if (isInitialLoadComplete && fuelData) {
      localStorage.setItem('fuelData', JSON.stringify(fuelData));
    }
  }, [fuelData, isInitialLoadComplete]);

  useEffect(() => {
    if (isInitialLoadComplete && runDetails) {
      localStorage.setItem('runDetails', JSON.stringify(runDetails));
    }
  }, [runDetails, isInitialLoadComplete]);

  return (
    <div>
      <RunModal open={modalOpen} onSubmit={handleModalSubmit} handleClose={handleClose} />

      {modalSubmitted && (
        <>
          <MainSheetView runDetails={runDetails} fuelData={fuelData} gridRowData={gridRowData} setGridRowData={updateAppGridRowData} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FuelManagementView fuelData={fuelData} onFuelDataChange={handleFuelDataChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RaceSummary gridRowData={gridRowData} runDetails={runDetails} />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowConfirmModal(true)}
            style={{ position: 'fixed', bottom: 20, right: 20 }}>
            New Race
          </Button>

          {/* Confirmation Modal */}
          <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
            <Box style={{ /* your styling for the modal box */ }}>
              <Typography variant="h6">Start a New Race?</Typography>
              <Typography>This will clear the current race data.</Typography>
              <Button onClick={handleNewRace}>Confirm</Button>
              <Button onClick={() => setShowConfirmModal(false)}>Cancel</Button>
            </Box>
          </Modal>
        </>
      )}

    </div>
  );
};

export default App;