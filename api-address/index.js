const express = require("express");
const app = express();
const port = process.env.PORT || 3002;
const axios = require("axios").default;
const cors = require("cors");
// const corsOptions = {
//   origin: frontendURL,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   preflightContinue: true,
//   credentials: true,
//   optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

app.use(cors());

app.get("/address/:postcode", async (req, res) => {
  const postcode = req.params.postcode;

  const body = await getUser(postcode);
  console.log(postcode, "postcode");
  res.send(JSON.stringify(body));
});

async function getUser(postcode) {
  try {
    // SG4 9NU

    let s = postcode.split(" ", [2]);
    let secondPart = s[1];
    let firstPart = s[0];
    // console.log(firstPart, secondPart, "p,s");

    let bettwenPart = "%20";
    let nextBettwenPart = "-";
    // let http =`https://services.postcodeanywhere.co.uk/Capture/Interactive/Find/v1.00/json3ex.ws?Key=YZ36-JY78-XM71-AK49&Text=${firstPart}${bettwenPart}${secondPart}&Origin=GBR&Language=en&Container=GB%7CRM%7CENG%7C${secondPart}${nextBettwenPart}${firstPart}&Filter=undefined&Instance=null&Test=false&$block=true&$cache=true`,
    const url = `https://services.postcodeanywhere.co.uk/Capture/Interactive/Find/v1.00/json3ex.ws?Key=YZ36-JY78-XM71-AK49&Text=${firstPart}${bettwenPart}${secondPart}&Origin=GBR&Language=en&Container=GB%7CRM%7CENG%7C${secondPart}${nextBettwenPart}${firstPart}&Filter=undefined&Instance=null&Test=false&$block=true&$cache=true`;

    console.log(url);

    const response = await axios.get(url, {
      headers: {
        "sec-ch-ua-mobile": "?0",
        Connection: "keep-alive",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        "sec-ch-ua":
          '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
        Accept: "*/*",
        Origin: "https://www.parcelforce.com",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        Referer: "https://www.parcelforce.com/",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    //console.log(response.data)
    const mainAddress = response.data.Items.map((a) => {
      return { addressAndCity: `${a.Text}, ${a.Description}` };
    });
    console.log(mainAddress);
    return mainAddress;
  } catch (error) {
    console.error(error, "error");
  }
}
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
