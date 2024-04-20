const { ObjectId } = require("mongodb");

class NhaXuatBanService {
    constructor(client) {
        this.NhaXuatBan = client.db().collection("nhaxuatban");
    }
    
    extractConactData(payload) {
        const nhaxuatban = {
            manxb: payload.manxb,
            tennxb: payload.tennxb,
            diachi: payload.diachi,
        };
        // Remove undefined fields
        Object.keys(nhaxuatban).forEach(
            (key) => nhaxuatban[key] === undefined && delete nhaxuatban[key]
        );
        return nhaxuatban;
    }

    async create(payload) {
        const nhaxuatban = this.extractConactData(payload);
        const result = await this.NhaXuatBan.findOneAndUpdate(
            nhaxuatban,
            { $set: nhaxuatban },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.NhaXuatBan.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            tennxb: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.NhaXuatBan.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractConactData(payload);
        const existingNhaXuatBan = await this.NhaXuatBan.findOne(filter);
        if (!existingNhaXuatBan) {
            return null; // or throw an error
        }
        const result = await this.NhaXuatBan.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }
    
    async delete(id) {
        const result = await this.NhaXuatBan.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.NhaXuatBan.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = NhaXuatBanService;
