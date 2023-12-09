import React, { useState } from 'react';
import RunModal from './components/RunModal';
import MainSheetView from './views/MainSheetView';
import FuelManagementView from './views/FuelManagementView';

const App = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [runDetails, setRunDetails] = useState(null);
  const [fuelData, setFuelData] = useState([]);

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

  return (
    <div>
      <RunModal open={modalOpen} onSubmit={handleModalSubmit} handleClose={handleClose} />

      {modalSubmitted && (
        <>
          <MainSheetView runDetails={runDetails} fuelData={fuelData} />
          <FuelManagementView onFuelDataChange={handleFuelDataChange} />
        </>
      )}
    </div>
  );
};

export default App;