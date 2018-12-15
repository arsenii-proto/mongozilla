import { SYSTEM } from "@/src/conts/MixinTypes";
import { getConnection } from "@/src/Connection";

/** @type {MongoZilla.Model.Schema} */
export const DBInjectable = {
  _$type: SYSTEM,
  methods: {
    async save() {
      const { connection, collection, manager, mapper } = this[SYSTEM];
      const { db } = await getConnection(connection || "default");
      const coll = db.collection(collection);
      const data = this.json;
      let { _id } = this;

      if (!mapper.fireChainReverse("validating", this)) {
        throw new Error("Saving model was aborted, not pass validating");
      }

      mapper.fire("validated", this);

      if (!mapper.fireChainReverse("saving", this)) {
        throw new Error("Saving model was aborted");
      }

      if (_id) {
        await coll.updateOne({ _id }, { $set: data }, { upsert: true });
      } else {
        const counters = db.collection("counters");

        if (!(await counters.find({ _id: collection }).count())) {
          await counters.updateOne(
            { _id: collection },
            { $set: { _id: collection, last: 0 } },
            { upsert: true }
          );
        }

        const { value } = await counters.findOneAndUpdate(
          { _id: collection },
          { $inc: { last: 1 } },
          { new: true }
        );

        const { insertedId } = await coll.insertOne({
          ...data,
          _id: value.last
        });

        _id = insertedId;
      }

      const original = await coll.findOne({ _id });

      manager.statically.getters.set("original", () => original);
      manager.statically.getters.set("atributes", () => ({}));

      mapper.fire("saved", this);

      return this;
    },
    async update(...args) {
      const { connection, collection, manager, mapper } = this[SYSTEM];
      const { db } = await getConnection(connection || "default");
      const coll = db.collection(collection);

      if (this._id) {
        this.fill(...args);

        if (!mapper.fireChainReverse("updating", this)) {
          throw new Error("Saving model was aborted");
        }

        await coll.updateOne({ _id }, { $set: data }, { upsert: true });

        mapper.fire("updated", this);

        return this;
      }

      return this.save();
    },
    async delete() {
      const { connection, collection, manager, mapper } = this[SYSTEM];
      const { db } = await getConnection(connection || "default");
      const coll = db.collection(collection);

      if (!mapper.fireChainReverse("deleting", this)) {
        throw new Error("Deleting model was aborted");
      }

      if (this._id) {
        await coll.deleteOne({ _id: this._id });
      }

      manager.statically.getters.set("original", () => ({}));
      manager.statically.getters.set("atributes", () => ({}));

      mapper.fire("deleted", this);

      return this;
    },
    async refresh() {
      const { connection, collection, manager, mapper } = this[SYSTEM];
      const { db } = await getConnection(connection || "default");
      const coll = db.collection(collection);
      let original = {};

      if (this._id) {
        original = await coll.findOne({ _id: this._id });
      }

      manager.statically.getters.set("original", () => original);
      manager.statically.getters.set("atributes", () => ({}));

      mapper.fire("refreshed", this);

      return this;
    }
  }
};
