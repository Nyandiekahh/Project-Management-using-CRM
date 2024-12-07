// src/controllers/officerController.js
const officerController = {
  getSeniorOfficers: async (req, res) => {
    try {
      // Mock data - replace with database query later
      const seniorOfficers = [
        { 
          id: 1, 
          name: 'John Doe',
          role: 'Senior Officer',
          department: 'Operations'
        },
        { 
          id: 2, 
          name: 'Jane Smith',
          role: 'Senior Officer',
          department: 'Planning'
        },
        { 
          id: 3, 
          name: 'Robert Johnson',
          role: 'Senior Officer',
          department: 'Assessment'
        }
      ];

      // Log for debugging
      console.log('Sending senior officers:', seniorOfficers);
      
      res.status(200).json(seniorOfficers);
    } catch (error) {
      console.error('Error in getSeniorOfficers:', error);
      res.status(500).json({ message: 'Error fetching senior officers' });
    }
  },

  getAllOfficers: async (req, res) => {
    try {
      // Mock data - replace with database query later
      const officers = [
        { 
          id: 1, 
          name: 'John Doe',
          role: 'Senior Officer',
          department: 'Operations'
        },
        { 
          id: 2, 
          name: 'Jane Smith',
          role: 'Senior Officer',
          department: 'Planning'
        },
        { 
          id: 3, 
          name: 'Robert Johnson',
          role: 'Senior Officer',
          department: 'Assessment'
        },
        { 
          id: 4, 
          name: 'Sarah Wilson',
          role: 'Junior Officer',
          department: 'Operations'
        }
      ];

      res.status(200).json(officers);
    } catch (error) {
      console.error('Error in getAllOfficers:', error);
      res.status(500).json({ message: 'Error fetching officers' });
    }
  }
};

module.exports = officerController;