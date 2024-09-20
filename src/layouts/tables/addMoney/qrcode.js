import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

export default function Qrcode({open,setOpen,data}) {
//   const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
    
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Scan the code below to comple the payment"}
        </DialogTitle>
        <DialogContent style={{
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
        }}>
        <QRCode value={data} renderAs="canvas" />,

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>close</Button>
         
        </DialogActions>
      </Dialog>
    </div>
  );
}

Qrcode.propTypes = {
    open: PropTypes.bool.isRequired, // Use PropTypes.bool for a boolean prop
    setOpen: PropTypes.func.isRequired, // Use PropTypes.func for a function prop
    data: PropTypes.string.isRequired, // Use PropTypes.bool for a boolean prop

  };