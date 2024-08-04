import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const ReportsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 28px;
  color: #343a40;
`;

const SortButton = styled.button`
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Select = styled.select`
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 10px;
  background-color: #f2f2f2;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #e6f7ff;
    cursor: pointer;
  }
`;

const TableData = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
`;

const Reports = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks');
        const data = await response.json();
        setTasks(data);
        setFilteredTasks(data); // Initialize filteredTasks with all tasks
        calculateFiscalYears(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const calculateFiscalYears = (tasks) => {
    const years = new Set();
    tasks.forEach(task => {
      const date = new Date(task.assignedAt);
      const fiscalYearStart = date.getMonth() >= 6 ? date.getFullYear() + 1 : date.getFullYear();
      years.add(fiscalYearStart);
    });
    const sortedYears = Array.from(years).sort();
    const fiscalYearOptions = sortedYears.map(year => `${year}-${year + 1}`);

    // Ensure we start from 2024-2025
    const startYear = 2024;
    const endYear = Math.max(...sortedYears);
    for (let year = startYear; year <= endYear; year++) {
      if (!years.has(year)) {
        fiscalYearOptions.push(`${year}-${year + 1}`);
      }
    }
    fiscalYearOptions.sort();

    setFiscalYears(fiscalYearOptions);
  };

  const sortAlphabetically = () => {
    const sortedTasks = [...filteredTasks].sort((a, b) => a.name.localeCompare(b.name));
    setFilteredTasks(sortedTasks);
  };

  const handleFiscalYearChange = (event) => {
    const fiscalYear = event.target.value;
    if (fiscalYear) {
      const [startYear, endYear] = fiscalYear.split('-').map(Number);
      const filtered = tasks.filter(task => {
        const date = new Date(task.assignedAt);
        const taskYear = date.getFullYear();
        const taskMonth = date.getMonth();
        if (taskMonth >= 6) {
          return taskYear + 1 === endYear;
        } else {
          return taskYear === startYear;
        }
      });
      setFilteredTasks(filtered);
    }
  };

  const handleRowClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <DashboardLayout>
      <ReportsContainer>
        <Title>Reports</Title>
        <div>
          <SortButton onClick={sortAlphabetically}>Sort Alphabetically</SortButton>
          <Select onChange={handleFiscalYearChange} defaultValue="">
            <option value="" disabled>Select Fiscal Year</option>
            {fiscalYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>
        </div>
        <TaskTable>
          <thead>
            <tr>
              <TableHeader>NO</TableHeader>
              <TableHeader>TASK ID</TableHeader>
              <TableHeader>TASK NAME</TableHeader>
              <TableHeader>DATE ASSIGNED</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <TableRow key={task.id} onClick={() => handleRowClick(task.id)}>
                <TableData>{index + 1}</TableData>
                <TableData>{task.id}</TableData>
                <TableData>{task.name}</TableData>
                <TableData>{new Date(task.assignedAt).toLocaleDateString()}</TableData>
              </TableRow>
            ))}
          </tbody>
        </TaskTable>
      </ReportsContainer>
    </DashboardLayout>
  );
};

export default Reports;
