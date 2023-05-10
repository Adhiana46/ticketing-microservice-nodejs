import https from "https";
import axios from "axios";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
axios.defaults.httpsAgent = httpsAgent;

const cookie =
  "session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkwTVRWaVpqTTNNbU00TmpsaU1XRmhNR0ppWWpoak55SXNJbVZ0WVdsc0lqb2lZWE5rWVhOa1FHZHRZV2xzTG1OdmJTSXNJbWxoZENJNk1UWTNPVEUwTmpnd09IMC5KMmpSQm90TFFsRy1yeFdjNm9GeWN0bDAxVHpsTEtrYUtnZFZkMDZXUTRJIn0=; Path=/; Secure; HttpOnly;";

const doRequest = async () => {
  const { data } = await axios.post(
    `https://ticketing-app.test/api/tickets`,
    { title: "ticket", price: 5 },
    {
      headers: { cookie },
    }
  );

  const resp1 = await axios.put(
    `https://ticketing-app.test/api/tickets/${data.id}`,
    { title: "ticket", price: 10 },
    {
      headers: { cookie },
    }
  );

  const resp2 = await axios.put(
    `https://ticketing-app.test/api/tickets/${data.id}`,
    { title: "ticket", price: 15 },
    {
      headers: { cookie },
    }
  );

  console.log("Request complete");
};

(async () => {
  for (let i = 0; i < 250; i++) {
    doRequest();
  }
})();
