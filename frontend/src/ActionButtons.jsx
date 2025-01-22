import React from "react";
import { Button, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";

const ActionButtons = ({ onSearch, onFilter, onSort }) => {
return (
    <Stack direction="row" spacing={1}>
        <Button
            size="small"
            variant="text"
            color="black"
            onClick={onSearch}
            sx={{ textTransform: "none", '&:hover': { backgroundColor: 'grey.300' } }}
            startIcon={<SearchIcon />}>
            Search
        </Button>

        <Button
            size="small"
            variant="text"
            color="black"
            onClick={onFilter}
            sx={{ textTransform: "none", '&:hover': { backgroundColor: 'grey.300' } }}
            startIcon={<FilterListIcon />}>
                    Filter
        </Button>

        <Button
            size="small"
            variant="text"
            color="black"
            onClick={onSort}
            sx={{ textTransform: "none", '&:hover': { backgroundColor: 'grey.300' } }}
            startIcon={<SortIcon />}>
                    Sort
        </Button>
    </Stack>
);
};

export default ActionButtons;
