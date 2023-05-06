import { DataGrid, DataGridProps, ukUA } from "@mui/x-data-grid"

function DataGridUkUA(props: DataGridProps) {
    return (
        <DataGrid
            {...props}
            localeText={ukUA.components.MuiDataGrid.defaultProps.localeText}
            sx={{
                "& .MuiDataGrid-virtualScroller": {
                    overflow: "hidden"
                }
            }} />
    )
}

export default DataGridUkUA