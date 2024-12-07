// src/controllers/officerController.js
const officerController = {
    getSeniorOfficers: async (req, res) => {
      const seniorOfficers = [
        { id: 1, name: 'Senior Officer 1' },
        { id: 2, name: 'Senior Officer 2' },
      ];
      res.json(seniorOfficers);
    }
  };
  
  module.exports = officerController;