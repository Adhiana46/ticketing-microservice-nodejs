import { Ticket } from "../ticket";

it("implement optimistic concurrency control", async () => {
  // create ticket
  const ticket = Ticket.build({
    title: "Konser Blackpink",
    price: 5,
    userId: "123",
  });
  await ticket.save();

  // fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make changes to ticket we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save first instance
  await firstInstance!.save();

  // save second instance, expected to throw an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("should not react this line");
});

it("increment the version number on multiple saves", async () => {
  // create ticket
  const ticket = Ticket.build({
    title: "Konser Blackpink",
    price: 5,
    userId: "123",
  });
  await ticket.save();

  expect(ticket.version).toEqual(0);

  // first saves
  ticket.set({ price: 10 });
  await ticket.save();

  expect(ticket.version).toEqual(1);

  // second saves
  ticket.set({ price: 15 });
  await ticket.save();

  expect(ticket.version).toEqual(2);
});
