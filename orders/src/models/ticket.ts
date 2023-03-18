import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  id: string;
  version: number;
  title: string;
  price: number;
}

interface TicketDoc extends mongoose.Document {
  version: number;
  title: string;
  price: number;
  isReserved(): Promise<Boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    version: {
      type: Number,
      required: true,
      min: 0,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.pre("save", async (done) => {
  // empty
  done();
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    version: attrs.version,
    title: attrs.title,
    price: attrs.price,
  });
};
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket, TicketDoc };
