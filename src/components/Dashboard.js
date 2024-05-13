import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import { PieChart, Pie, Legend, Tooltip } from 'recharts'; // Import components from Recharts
import TimeChart from './TimeChart'; // Import the TimeChart component
import axios from 'axios';

function Dashboard({ onBackClick }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [webActivities, setWebActivities] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedNavItem, setSelectedNavItem] = useState('History');
  const [sitesData, setSitesData] = useState([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Fetch web activities data from the backend
    axios.get('http://localhost:9000/data')
      .then(response => {
        // Filter the data based on the user name stored in localStorage
        const userName = localStorage.getItem('userName');
        const filteredData = response.data.filter(activity => activity.user === userName);
        setWebActivities(filteredData);

        // Derive columns from the first row of data
        if (filteredData.length > 0) {
          const firstRow = filteredData[0];
          const dynamicColumns = Object.keys(firstRow).filter(key => key !== '_id' && key !== '__v' && key!=='mobile' && key!=='password').map(key => ({
            id: key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            minWidth: 100,
          }));
          setColumns(dynamicColumns);
        }
      })
      .catch(error => {
        console.error('Error fetching web activities data:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedNavItem === 'Productive') {
      // Retrieve productive sites from localStorage
      const productiveData = JSON.parse(localStorage.getItem('productive')) || [];
      const unproductiveData = JSON.parse(localStorage.getItem('unproductive')) || [];
      
      const allSites = [...productiveData, ...unproductiveData];

      setSitesData(allSites);

      // Fetch usage data for all sites
      fetchUsageForSites(allSites);
    }
  }, [selectedNavItem]);

  const fetchUsageForSites = (sites) => {
    // Fetch usage data for each site
    Promise.all(sites.map(site =>
      axios.get(`http://localhost:9000/usage/${site}`)
        .then(response => ({ name: site, usage: response.data.usage }))
        .catch(error => {
          console.error(`Error fetching usage data for ${site}:`, error);
          return { name: site, usage: 0 }; // Set default usage to 0 if there's an error
        })
    ))
      .then(updatedSites => {
        setSitesData(updatedSites);
      })
      .catch(error => {
        console.error('Error fetching usage data:', error);
      });
  };

  const formatTime = (seconds) => {
    if (seconds >= 3600) {
      return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    } else if (seconds >= 60) {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleNavItemChange = (selectedItem) => {
    setSelectedNavItem(selectedItem);
  };

  const handleFeedbackClick = () => {
    const userName = localStorage.getItem('userName');
    console.log(userName)
    axios.get(`http://localhost:9000/feedback/${userName}`)
      .then(response => {
        setFeedback(response.data.feedback);
      })
      .catch(error => {
        console.error('Error fetching feedback:', error);
      });
  };

  const renderTableData = () => {
    return webActivities
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row, rowIndex) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
          {columns.map((column) => (
            <TableCell key={column.id} align="left">
              {column.id === 'name' ? (row[column.id].length > 22 ? `${row[column.id].slice(0, 22)}...` : row[column.id]) : // Rendering logic for name column
                column.id === 'date' ? row[column.id].slice(0, 10) : 
                column.id === 'usage' ? formatTime(row[column.id]) : row[column.id]}
            </TableCell>
          ))}
        </TableRow>
      ));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', height: '100vh' }}>
      <Drawer
        sx={{
          width: 120,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 140,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          {['History', 'Productive', 'Plot View', 'Feedback'].map((text) => (
            <ListItem button key={text} onClick={() => handleNavItemChange(text)} selected={selectedNavItem === text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div style={{ flexGrow: 1, padding: '20px', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" style={{
            marginBottom: '20px',
            marginLeft:'20px',color:"orange"
          }}>Dashboard</Typography>
          <Button onClick={onBackClick} variant="outlined" style={{ marginBottom: '20px', marginLeft: '30px',width:'180px',border:'1px solid black',borderRadius:'5px' }}>Back to Mainpage</Button>
        </div>
        {selectedNavItem === 'History' && (
          <Paper style={{ width: '100%', overflow: 'auto' }}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align="left"
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderTableData()}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 20, 100]}
              component="div"
              count={webActivities.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
        
        {selectedNavItem === 'Productive' && (
          <div>
            <Typography variant="h6">Productive vs Unproductive</Typography>
            <PieChart width={400} height={400}>
              <Pie
                dataKey="usage"
                data={sitesData}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              />
             {/* <Tooltip formatter={(value) => formatTime(value)} /> */}
              <Legend />
            </PieChart>
            <ul>
              {sitesData.map((site, index) => (
                <li key={index}>
                  {site.name} - {site.usage ? formatTime(site.usage) : 'Loading...'}
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedNavItem === 'Plot View' && (
          <TimeChart />
        )}
        {selectedNavItem === 'Feedback' && (
          <div>
            <Button onClick={handleFeedbackClick} variant="contained" color="primary" style={{width:"200px"}}>Get Feedback</Button>
            <Typography variant="h6" style={{ marginTop: '20px' }}>Feedback: {feedback}</Typography>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
