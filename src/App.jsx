import React, { useState, useEffect } from 'react';
import RunModal from './components/RunModal';
import MainSheetView from './views/MainSheetView';
import FuelManagementView from './views/FuelManagementView';
import RaceSummary from './views/RaceSummary';
import { Grid, Button, Modal, Box, Typography, Paper } from '@mui/material';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [runDetails, setRunDetails] = useState(null);
  const [fuelData, setFuelData] = useState([]);
  const [gridRowData, setGridRowData] = useState([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

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

          {/* New Race Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowConfirmModal(true)}
          >
            New Race
          </Button>

          {/* Confirmation Modal */}
          <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
            <Box
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                outline: 'none'
              }}
            >
              <Paper elevation={3} style={{ padding: '20px', borderRadius: '15px' }}>
                <Typography variant="h6" style={{ marginBottom: '10px' }}>Start a New Race?</Typography>
                <Typography style={{ marginBottom: '20px' }}>This will clear the current race data.</Typography>
                <Button variant="contained" color="primary" onClick={handleNewRace} style={{ marginRight: '10px' }}>
                  Confirm
                </Button>
                <Button variant="outlined" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </Button>
              </Paper>
            </Box>
          </Modal>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowHelpModal(true)}
            sx={{ml: 2}}
          >
            App Help
          </Button>

          <Modal open={showHelpModal} onClose={() => setShowHelpModal(false)}>
            <Box
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                outline: 'none'
              }}
            >
              <Paper elevation={3} style={{ padding: '20px', borderRadius: '15px' }}>
                <Typography variant="h4" style={{ marginBottom: '10px' }}>Log Runbook Help</Typography>

                <Typography paragraph>
                  Log Runbook is designed to help runners plan and track their nutrition and race strategy. Whether you're preparing for a marathon or a casual run, this app can assist you in organizing and analyzing your run details.
                </Typography>

                <Typography variant="h5" gutterBottom>Main Features</Typography>
                <Typography paragraph>
                  - <strong>Fuel Management:</strong> Add and manage your nutritional items and track their intake.
                </Typography>
                <Typography paragraph>
                  - <strong>Race Planning:</strong> Set up race intervals and plan your nutrition and hydration strategy.
                </Typography>
                <Typography paragraph>
                  - <strong>Summary Insights:</strong> View summaries of your nutritional intake and race plans.
                </Typography>

                <Typography variant="h5" gutterBottom>Getting Started</Typography>
                <Typography paragraph>
                  1. Set up your race details in the modal that pops up (assuming you don't already have any existing races).
                </Typography>
                <Typography paragraph>
                  2. Add fuel items and customize your nutritional needs.
                </Typography>
                <Typography paragraph>
                  3. Plan each interval of your race using the fuel items you've added.
                </Typography>
                <Typography paragraph>
                  4. You can also add the temperature, race time, and notes for each interval.
                </Typography>
                <Typography paragraph>
                  5. Review the race summary for a complete overview of your strategy.
                </Typography>

                <Typography variant="h5" gutterBottom>FAQs</Typography>
                <Typography paragraph>
                  - <strong>How do I add a new fuel item?</strong> Navigate to Fuel Management and click on 'Add Fuel Item'.
                </Typography>
                <Typography paragraph>
                  - <strong>Can I export my data?</strong> Yes, you can export your data. You can export the fuel management sheet and the race sheet separately.
                </Typography>
                <Typography paragraph>
                  - <strong>I want to run a race with my current fuel setup. Is that possible?</strong> Yes. You can export your fuel setup as a CSV, then import it when you have a new race to run.
                </Typography>

                <Typography variant="h5" gutterBottom>Need More Help? (Contact)</Typography>
                <Typography paragraph>
                  If you have further questions or need support, feel free to contact me at <a href="mailto:p.vincent.zhen@gmail.com">p.vincent.zhen@gmail.com</a> or if you're more
                  programmer-inclined, you can also go to my Github repo and make a PR or fork it and make
                  your own version of this app: <a href="https://github.com/mdb-vzeddie/log-runbook" target="_blank" rel="noopener noreferrer">
                    https://github.com/mdb-vzeddie/log-runbook
                  </a>.
                </Typography>

              </Paper>
            </Box>
          </Modal>
        </>
      )
      }

    </div >
  );
};

export default App;