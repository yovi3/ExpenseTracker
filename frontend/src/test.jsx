import React, { useState } from "react";
import {
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
} from '@mui/material';
import { Search, FilterList, Sort } from '@mui/icons-material'

const sampleData = [
    { id: 1, name: "John Doe", age: 28 },
    { id: 2, name: "Jane Smith", age: 34 },
  ];
  

const EnhancedTableWithFilter = ({ data = [] }) => {
    const [filterText, setFilterText] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
  
    const handleFilterChange = (e) => {
      setFilterText(e.target.value);
    };
  
    const handleFilterClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleFilterClose = () => {
      setAnchorEl(null);
    };
  
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase())
    );
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TextField
            label="Search"
            variant="outlined"
            value={filterText}
            onChange={handleFilterChange}
          />
          <IconButton onClick={handleFilterClick}>
            <FilterList style={{ color: "purple" }} />
          </IconButton>
          <IconButton>
            <Sort />
          </IconButton>
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem onClick={handleFilterClose}>Filter Option 1</MenuItem>
          <MenuItem onClick={handleFilterClose}>Filter Option 2</MenuItem>
        </Menu>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  export default EnhancedTableWithFilter;
  
