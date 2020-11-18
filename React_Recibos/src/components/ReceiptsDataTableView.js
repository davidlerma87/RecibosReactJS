import React, {useState, useEffect} from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import EditReceiptModal from './EditReceiptModal.js';

const columnsConfig = [
    { title: "Id", field: "id"},
    { title: "Supplier", field: "supplierId", type:"numeric"},
    { title: "Amount", field: "amount", type:"numeric"},
    { title: "Currency", field: "currencyId", type:"numeric"},
    { title: "User", field: "userId", type:"numeric"},
    { title: "Date", field: "date", type:"date"},
    { title: "Comments", field: "comments"}
]

const baseUrl = "https://localhost:44385/api/Receipt";

function ReceiptsDataTableView() {  
    var config = {
        headers: {'Access-Control-Allow-Origin': '*'}
    };
    const [data, setData] = useState([]);
    const getReceipts = async()=>{
        await axios.get(baseUrl, config)
            .then(response=>{
        setData(response.data.data);
            }).catch(error=>{
        console.log(error);
        })
    }

    useEffect(() => {
        getReceipts();
    }, []);    

    const paginationConfig = {
        rowsPerPageText: "Rows",
        rangeSeparatorText: "To",
        selectAllRowsItem: true,
        selectAllRowsItemText: "All"
    }

    // ----------------------MODAL-----------------------
    // const classes = useStyles();
    // const [modalStyle] = React.useState(getModalStyle);
    // const [open, setOpen] = React.useState(false);

    // const handleOpen = () => {
    //     setOpen(true);
    // };

    // const handleClose = () => {
    //     setOpen(false);
    // };

    return(
        <React.Fragment>
            <div>
            <div className="table-top-bar">
            {/* <EditReceiptModal></EditReceiptModal> */}
            </div>
                <MaterialTable
                    title="Receipts list"
                    columns={columnsConfig}
                    data={data}
                    options={{
                        actionsColumnIndex: -1
                     }}
                    actions={
                        [
                            {icon: 'edit', tooltip: 'Edit receipt', 
                                onClick: (event, rowData) => alert(rowData.supplier)},
                            {icon: 'delete', tooltip: 'Delete receipt'}
                        ]
                    }
                />
                
            </div>                
        </React.Fragment>            
    );
}


export default ReceiptsDataTableView;