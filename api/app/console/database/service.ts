import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { DatabaseRepository } from "database/repositorys/Database";
import { Request } from "express";
import paypal from "utils/paypal";
import { Invoice } from "database/entitys/Invoice";

@Injectable()
export class DatabaseService {
  constructor() {}

  @Inject(REQUEST) private request: Request;
  @Inject() private repository: DatabaseRepository;

  async create(params: { [x: string]: any }) {
    if (process.env.NODE_ENV !== "production" && params.force) {
      const database = await this.repository._create({
        ...(params as any),
        user: this.request.session.user.id,
      });

      return this.repository.decriptPassword([database])[0];
    }

    if (!["postgres", "mysql", "mariadb"].includes(params.type)) {
      throw "database.create.incorect_type";
    }

    if (!/^[a-z]+$/.test(params.name)) throw "database.create.incorect_name";

    if (![1, 3, 6, 12].includes(params.months)) {
      throw "database.create.incorect_months";
    }
    if (![1, 5, 8].includes(params.size)) {
      throw "database.create.incorect_size";
    }

    const invoice = new Invoice();
    invoice.provider = "paypal";
    invoice.command = {
      type: params.type,
      name: params.name,
      size: params.size,
      months: params.months,
    };

    const pricies = { 1: 5, 5: 10, 8: 18 };
    invoice.command.price =
      pricies[invoice.command.size] * invoice.command.months;

    invoice.generateId();
    const order = await paypal.createOrder(invoice.command.price, invoice.id);
    invoice.command.order = order.id;

    await invoice.save();
    return invoice;
  }

  async validate(params: { orderID: string }) {
    const order = await paypal.captureOrder(params.orderID);
    if (order.status !== "COMPLETED") {
      throw "database.validate.order_not_completed";
    }

    const id: string = order.purchase_units[0].payments.captures[0].custom_id;
    const invoiceRepo = this.repository.manager.getRepository(Invoice);
    const invoice = await invoiceRepo.findOneByOrFail({ id });

    const database = await this.repository._create({
      ...(invoice.command as any),
      user: this.request.session.user.id,
    });

    invoice.database = database;
    await invoice.save();

    return this.repository.decriptPassword([database])[0];
  }

  async regeneratePassword(params: { [x: string]: any }) {
    const database = await this.repository._regeneratePassword({
      id: params.id,
      user: this.request.session.user.id,
    });

    return this.repository.decriptPassword([database])[0];
  }

  async list() {
    const databases = await this.repository._find({
      user: this.request.session.user.id,
    });

    return this.repository.decriptPassword(databases);
  }

  async remove(params: { id: string }) {
    await this.repository._remove({
      id: params.id,
      user: this.request.session.user.id,
    });

    return { id: params.id };
  }
}
