import React, { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {makeStyles} from '@material-ui/core/styles';
import './assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const columnsConfig = [
  { title: "Id", field: "id"},
  { title: "Supplier", field: "supplierId", type:"numeric"},
  { title: "Amount", field: "amount", type:"numeric"},
  { title: "Currency", field: "currencyId", type:"numeric"},
  { title: "User", field: "userId", type:"numeric"},
  { title: "Date", field: "date", type:"date"},
  { title: "Comments", field: "comments"}
]

const receiptsUrl="https://localhost:44385/api/Receipt";
const suppliersUrl="https://localhost:44385/api/Supplier";
const currenciesUrl="https://localhost:44385/api/Currency";


const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {
  const styles= useStyles();
  const [data, setData]= useState([]);
  const [modalInsert, setModalInsert]= useState(false);
  const [modalEdit, setModalEdit]= useState(false);
  const [modalDelete, setModalDelete]= useState(false);
  const [receiptSelected, setSelectedReceipt]=useState({
    id: "",
    supplierId: "",
    amount: "",
    currencyId: "",
    userId: "",
    date: "",
    comments: ""
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setSelectedReceipt(prevState=>({
      ...prevState,
      [name]: value
    }));
  }

  const handleChangeSupplier=e=> {
    const {name, value}=e.target;
    // setSelectedReceipt(prevState=>({
    //   ...prevState,
    //   [name]: value
    // }));
  }

  const getSuppliers=async()=>{
    await axios.get(suppliersUrl)
    .then(response=>{
     setData(response.data.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const getCurrencies=async()=>{
    await axios.get(currenciesUrl)
    .then(response=>{
     setData(response.data.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const getReceipts=async()=>{
    await axios.get(receiptsUrl)
    .then(response=>{
     setData(response.data.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const receiptPost=async()=>{
    await axios.post(receiptsUrl, receiptSelected)
    .then(response=>{
      setData(data.concat(response.data));
      openCloseModalInsert();
    }).catch(error=>{
      console.log(error);
    })
  }

  const receiptPut=async()=>{
    await axios.put(receiptsUrl+"/"+receiptSelected.id, receiptSelected)
    .then(response=>{
      var responseData= data;
      responseData.map(receipt=>{
        if(receipt.id===receiptSelected.id){
          receipt.id = receiptSelected.id;
          receipt.supplierId = receiptSelected.supplierId;
          receipt.amount = receiptSelected.amount;
          receipt.currencyId = receiptSelected.currencyId;
          receipt.userId = receiptSelected.userId;
          receipt.date = receiptSelected.date;
          receipt.comments = receiptSelected.comments;
        }
      });
      setData(responseData);
      openCloseModalEdit();
    }).catch(error=>{
      console.log(error);
    })
  }

  const receiptDelete=async()=>{
    await axios.delete(receiptsUrl+"/"+receiptSelected.id)
    .then(response=>{
      setData(data.filter(receipt=>receipt.id!==receiptSelected.id));
      openCloseModalDelete();
    }).catch(error=>{
      console.log(error);
    })
  }

  const selectReceipt=(receipt, modalType)=>{
    setSelectedReceipt(receipt);
    (modalType==="edit")?openCloseModalEdit()
    :
    openCloseModalDelete()  
  }

  const openCloseModalInsert=()=>{
    setModalInsert(!modalInsert);
  }

  
  const openCloseModalEdit=()=>{
    setModalEdit(!modalEdit);
  }

  const openCloseModalDelete=()=>{
    setModalDelete(!modalDelete);
  }

  useEffect(()=>{
    getReceipts();
  }, [])

  const bodyInsert=(
    <div className={styles.modal}>
      <h3>Add New Receipt</h3>
      {/* <TextField className={styles.inputMaterial} label="Id" name="id" onChange={handleChange}/> */}
      <br /> <br />
      <Select className={styles.inputMaterial}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={2} 
          onChange={handleChangeSupplier}>
          <MenuItem value={1}>Proveedor 1</MenuItem>
          <MenuItem value={2}>Proveedor 2</MenuItem>
          <MenuItem value={3}>Proveedor 3</MenuItem>
        </Select>
        <br/>
      <TextField className={styles.inputMaterial} label="Amount" name="amount" onChange={handleChange}/>          
<br />
<TextField className={styles.inputMaterial} label="Date" name="date" onChange={handleChange}/>
      <br />
<TextField className={styles.inputMaterial} label="Comments" name="comments" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>receiptPost()}>Save</Button>
        <Button onClick={()=>openCloseModalInsert()}>Cancel</Button>
      </div>
    </div>
  )

  const bodyEdit=(
    <div className={styles.modal}>
      <h3>Edit Receipt</h3>
      <TextField className={styles.inputMaterial} label="Id" name="id" onChange={handleChange} value={receiptSelected&&receiptSelected.id}/>
      <br /> <br />
      <Select className={styles.inputMaterial}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={receiptSelected&&receiptSelected.supplierId}
          onChange={handleChangeSupplier}>
          <MenuItem value={1}>Proveedor 1</MenuItem>
          <MenuItem value={2}>Proveedor 2</MenuItem>
          <MenuItem value={3}>Proveedor 3</MenuItem>
        </Select>
<br />
<TextField className={styles.inputMaterial} label="Amount" name="amount" onChange={handleChange} value={receiptSelected&&receiptSelected.amount}/>
      <br />
      <TextField className={styles.inputMaterial} label="Date" name="date" onChange={handleChange} value={receiptSelected&&receiptSelected.date}/>
      <br />
<TextField className={styles.inputMaterial} label="Comments" name="comments" onChange={handleChange} value={receiptSelected&&receiptSelected.comments}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>receiptPut()}>Save</Button>
        <Button onClick={()=>openCloseModalEdit()}>Cancel</Button>
      </div>
    </div>
  )

  const bodyDelete=(
    <div className={styles.modal}>
      <p>Are you sure you want to delete this Receipt <b>{receiptSelected && receiptSelected.id}</b>? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>receiptDelete()}>Sí</Button>
        <Button onClick={()=>openCloseModalDelete()}>No</Button>

      </div>

    </div>
  )

  return (
    <div className="App">
      <br />
      <Button onClick={()=>openCloseModalInsert()}>New Receipt</Button>
      <br /><br />
     <MaterialTable
          columns={columnsConfig}
          data={data}
          title="Receipt list"  
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit Receipt',
              onClick: (event, rowData) => selectReceipt(rowData, "edit")
            },
            {
              icon: 'delete',
              tooltip: 'Delete Receipt',
              onClick: (event, rowData) => selectReceipt(rowData, "delete")
            }
          ]}
          options={{
            actionsColumnIndex: -1,
          }}
          localization={{
            header:{
              actions: "Actions"
            }
          }}
        />


        <Modal
        open={modalInsert}
        onClose={openCloseModalInsert}>
          {bodyInsert}
        </Modal>

        
        <Modal
        open={modalEdit}
        onClose={openCloseModalEdit}>
          {bodyEdit}
        </Modal>

        <Modal
        open={modalDelete}
        onClose={openCloseModalDelete}>
          {bodyDelete}
        </Modal>
    </div>
  );
}

export default App;
