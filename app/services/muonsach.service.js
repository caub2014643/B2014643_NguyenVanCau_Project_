const { ObjectId } = require("mongodb");

class MuonSachService {
    constructor(client) {
        this.MuonSach = client.db().collection("theodoimuonsach");
    }
    
    extractConactData(payload) {
        const muonsach = {
            madocgia: payload.madocgia,
            masach: payload.masach,
            ngaymuon: payload.ngaymuon,
            ngaytra: payload.ngaytra,
        };
        // Remove undefined fields
        Object.keys(muonsach).forEach(
            (key) => muonsach[key] === undefined && delete muonsach[key]
        );
        return muonsach;
    }

    async create(payload) {
        const muonsach = this.extractConactData(payload);
        const result = await this.MuonSach.findOneAndUpdate(
            muonsach,
            { $set: muonsach },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.MuonSach.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            madocgia: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.MuonSach.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractConactData(payload);
        const existingMuonSach = await this.MuonSach.findOne(filter);
        if (!existingMuonSach) {
            return null; // or throw an error
        }
        const result = await this.MuonSach.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }
    
    async delete(id) {
        const result = await this.MuonSach.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.MuonSach.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = MuonSachService;
