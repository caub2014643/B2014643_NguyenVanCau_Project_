const { ObjectId } = require("mongodb");

class DocGiaService {
    constructor(client) {
        this.DocGia = client.db().collection("docgia");
    }
    
    extractConactData(payload) {
        const docgia = {
            madocgia: payload.madocgia,
            holot: payload.holot,
            ten: payload.ten,
            ngaysinh: payload.ngaysinh,
            phai: payload.phai,
            diachi: payload.diachi,
            dienthoai: payload.dienthoai,
        };
        // Remove undefined fields
        Object.keys(docgia).forEach(
            (key) => docgia[key] === undefined && delete docgia[key]
        );
        return docgia;
    }

    async create(payload) {
        const docgia = this.extractConactData(payload);
        const result = await this.DocGia.findOneAndUpdate(
            docgia,
            { $set: docgia },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.DocGia.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            madocgia: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.DocGia.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractConactData(payload);
        const existingDocGia = await this.DocGia.findOne(filter);
        if (!existingDocGia) {
            return null; // or throw an error
        }
        const result = await this.DocGia.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }
    
    async delete(id) {
        const result = await this.DocGia.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.DocGia.deleteMany({});
        return result.deletedCount;
    }
    async login(madocgia, dienthoai) {
        // Tìm nhân viên dựa trên số điện thoại
        const docGia = await this.DocGia.findOne({ madocgia });
        // Kiểm tra xem nhân viên có tồn tại không
        if (!docGia) {
            return { success: false, message: "Người dùng không tồn tại" };
        }
        // Kiểm tra mật khẩu
        if (docGia.dienthoai !== dienthoai) {
            return { success: false, message: "Mật khẩu không đúng" };
        }
        // Trả về thông tin nhân viên nếu xác thực thành công
        return { success: true, docGia };
    }
}

module.exports = DocGiaService;
