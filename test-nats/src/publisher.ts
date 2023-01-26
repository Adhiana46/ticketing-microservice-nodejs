import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "pub", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: "123",
    title: "Konser LISA Blackpink",
    price: 25,
  });

  stan.publish(
    "ticket:created",
    data,
    (err: Error | undefined, guid: string) => {
      if (err != undefined) {
        console.error("Failed publish a message: ", err);
      } else {
        console.log("Message published: ", guid);
      }
    }
  );
});
