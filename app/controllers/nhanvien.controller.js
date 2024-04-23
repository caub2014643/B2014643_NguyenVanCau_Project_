const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.msnv) {
        return next(new ApiError(400, "Mã số nhân viên không được để trống!"));
    }
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo nhân viên!")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const { hotennv } = req.query;
        if (hotennv) {
            documents = await nhanvienService.findByName(hotennv);
        } else {
            documents = await nhanvienService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi truy xuất nhân viên!")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.findById(req.params.sodienthoai);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên!"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Lỗi khi truy xuất nhân viên với id= ${req.params.sodienthoai}`
            )
        );
    }
};
exports.findOneCV = async (req, res, next) => {
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.findById(req.params.chucvu);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên!"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Lỗi khi truy xuất nhân viên với id= ${req.params.chucvu}`
            )
        );
    }
};
exports.update = async (req, res, next) => {
    if (!req.params.id) {
        return next(new ApiError(400, "Mã số nhân viên không được để trống!"));
    }
    
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên!"));
        }
        return res.send({ message: "Nhân viên đã được cập nhật thành công!" });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi cập nhật nhân viên với id=${req.params.id}`)
        );
    }   
};

exports.delete = async (req, res, next) => {
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên!"));
        }
        return res.send({ message: "Nhân viên đã được xóa thành công!" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa nhân viên với id=${req.params.id}`
            )
        );
    }
};

exports.login = async (req, res, next) => {
    const { sodienthoai, password } = req.body;

    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const result = await nhanvienService.login(sodienthoai, password);

        if (!result.success) {
            // Trường hợp xác thực không thành công, trả về lỗi
            return next(new ApiError(401, result.message));
        }

        // Trường hợp xác thực thành công, trả về thông tin nhân viên
        return res.send(result.nhanVien);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xác thực người dùng!")
        );
    }
};

exports.getMaNV = async (req, res, next) => {
    
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const result = await nhanvienService.getMaNV();

        if (!result.success) {
            // Trường hợp xác thực không thành công, trả về lỗi
            return next(new ApiError(401, result.message));
        }

        // Trường hợp xác thực thành công, trả về thông tin nhân viên
        return res.send(result);
    } catch (error) {
        
    }
};


