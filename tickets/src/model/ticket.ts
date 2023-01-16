import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new ticket
interface TicketFields {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties
// that Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(fields: TicketFields): TicketDoc;
}

// An interface that describe the properties
// that Ticket document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

ticketSchema.pre("save", async function (done) {
  // empty
  done();
});

ticketSchema.statics.build = (fields: TicketFields) => {
  return new Ticket(fields);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
