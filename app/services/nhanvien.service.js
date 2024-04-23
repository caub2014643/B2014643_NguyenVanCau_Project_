const { ObjectId } = require("mongodb");

class NhanVienService {
    constructor(client) {
        this.NhanVien = client.db().collection("nhanvien");
    }
    
    extractConactData(payload) {
        const nhanvien = {
            msnv: payload.msnv,
            hotennv: payload.hotennv,
            password: payload.password,
            chucvu: payload.chucvu,
            diachi: payload.diachi,
            sodienthoai: payload.sodienthoai,
        };
        // Remove undefined fields
        Object.keys(nhanvien).forEach(
            (key) => nhanvien[key] === undefined && delete nhanvien[key]
        );
        return nhanvien;
    }

    async create(payload) {
        const nhanvien = this.extractConactData(payload);
        const result = await this.NhanVien.findOneAndUpdate(
            nhanvien,
            { $set: nhanvien },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.NhanVien.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            hotennv: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.NhanVien.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractConactData(payload);
        const existingNhanVien = await this.NhanVien.findOne(filter);
        if (!existingNhanVien) {
            return null; // or throw an error
        }
        const result = await this.NhanVien.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }
    
    async delete(id) {
        const result = await this.NhanVien.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async login(sodienthoai, password) {
        // Tìm nhân viên dựa trên số điện thoại
        const nhanVien = await this.NhanVien.findOne({ sodienthoai });
        // Kiểm tra xem nhân viên có tồn tại không
        if (!nhanVien) {
            return { success: false, message: "Người dùng không tồn tại" };
        }
        // Kiểm tra mật khẩu
        if (nhanVien.password != password) {
            return { success: false, message: "Mật khẩu không đúng" };
        }
        // Trả về thông tin nhân viên nếu xác thực thành công
        return { success: true, nhanVien };
    }
    async getMaNV() {
        const chucVu = "nhanvien";
        const result = await this.NhanVien.finOneCV(chucVu);
        return result.msnv;
    }
    
}

module.exports = NhanVienService;
