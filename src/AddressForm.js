import React, { Fragment, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Container, Paper } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import "fontsource-roboto";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      padding: "1em",
      borderColor: "#7B68EE",
    },
  },
  paper: {
    padding: theme.spacing(5),
  },
  form: {
    paddingBottom: "20px",
    borderColor: "#7B68EE",
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
}));

const apiUrl = process.env.REACT_APP_APIURL || "http://localhost:3002";

const AddressForm = () => {
  const classes = useStyles();
  const [address, setAddress] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [fillAddress, setFillAddress] = useState({
    line1: "",
    line2: "",
    postcode: "",
    city: "",
  });
  const fetchAddress = async (postcode) => {
    console.log(postcode);
    try {
      const response = await fetch(`${apiUrl}/address/${postcode}`);
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        console.log(data, "data");
        setAddress(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Fragment>
      <Container maxWidth="sm">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              UK Address Lookup
            </Typography>
          </Toolbar>
        </AppBar>
        <Paper elevation={12} className={classes.paper} square>
          <div className={classes.root}>
            <form noValidate autoComplete="on">
              <Autocomplete
                className={classes.form}
                id="postcode"
                open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={(e) => {
                  setOpen(false);
                }}
                onChange={(e) => {
                  console.log(e.target.textContent, 555);
                  const t = e.target.textContent.split(", ");
                  console.log(t, "t");
                  let line1;
                  let line2;
                  let city;
                  let postcode;

                  if (t.length >= 4) {
                    line1 = t[0];
                    line2 = t[1];
                    city = t[2];
                    postcode = t[3];
                    setFillAddress({
                      line1,
                      line2,
                      city,
                      postcode,
                    });
                  } else if (t.length === 3) {
                    line1 = t[0];
                    city = t[1];
                    postcode = t[2];
                    setFillAddress({
                      line1,
                      city,
                      postcode,
                    });
                  }
                }}
                getOptionSelected={(option, value) => {
                  return option.addressAndCity === value.addressAndCity;
                }}
                getOptionLabel={(option) => option.addressAndCity}
                options={address}
                onChangeCapture={(e) => fetchAddress(e.target.value)}
                renderInput={(params) => (
                  <TextField {...params} label="Postcode" variant="outlined" />
                )}
              />
              {address ? (
                <Fragment>
                  <TextField
                    className={classes.form}
                    id="outlined-basic"
                    label="Line 1"
                    InputProps={{
                      value: fillAddress.line1,
                      onChange: (e) =>
                        setFillAddress({
                          ...fillAddress,
                          line1: e.target.value,
                        }),
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.form}
                    id="outlined-basic"
                    label="Line 2"
                    InputProps={{
                      value: fillAddress.line2,
                      onChange: (e) =>
                        setFillAddress({
                          ...fillAddress,
                          line2: e.target.value,
                        }),
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.form}
                    id="outlined-basic"
                    label="Postcode"
                    InputProps={{
                      value: fillAddress.postcode,
                      onChange: (e) =>
                        setFillAddress({
                          ...fillAddress,
                          postcode: e.target.value,
                        }),
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.form}
                    id="outlined-basic"
                    label="City"
                    InputProps={{
                      value: fillAddress.city,
                      onChange: (e) =>
                        setFillAddress({
                          ...fillAddress,
                          city: e.target.value,
                        }),
                    }}
                    fullWidth
                  />
                </Fragment>
              ) : (
                ""
              )}
            </form>
          </div>
        </Paper>
      </Container>
    </Fragment>
  );
};

/*
https://services.postcodeanywhere.co.uk/Capture/Interactive/Find/v1.00/json3ex.ws?Key=YZ36-JY78-XM71-AK49&Text=SG4%209NU&Origin=GBR&Language=en&Container=GB%7CRM%7CENG%7C9NU-SG4&Filter=undefined&Instance=null&Test=false&$block=true&$cache=true

*/

export default AddressForm;
