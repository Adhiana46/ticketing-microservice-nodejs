import https from "https";
import axios from "axios";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
axios.defaults.httpsAgent = httpsAgent;

const cookie =
  "session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkwTVRCaE5UQXlOamxtTVRWaE5ERmpOemd5T0RKbU55SXNJbVZ0WVdsc0lqb2lZWE5rWVhOa1FHZHRZV2xzTG1OdmJTSXNJbWxoZENJNk1UWTNPRGd4TWpReE9YMC41Z285MGNfcHhsSVBvbjZwdDVCaVBlS1dNUDVqdUFhTWFvYm5wREExR2cwIn0=; Path=/; Secure; HttpOnly;";

const doRequest = async () => {
  const { data } = await axios.post(
    `https://ticketing-app.test/api/tickets`,
    { title: "ticket", price: 5 },
    {
      headers: { cookie },
    }
  );

  await axios.put(
    `https://ticketing-app.test/api/tickets/${data.id}`,
    { title: "ticket", price: 10 },
    {
      headers: { cookie },
    }
  );

  await axios.put(
    `https://ticketing-app.test/api/tickets/${data.id}`,
    { title: "ticket", price: 15 },
    {
      headers: { cookie },
    }
  );
};

for (let i = 0; i < 1000; i++) {
  doRequest();
}
