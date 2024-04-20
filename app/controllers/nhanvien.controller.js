const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.msnv) {
        return next(new ApiError(400, "Mã số nhân viên không được để trống!"));
    }
    try {
        const bookService = new NhanVienService(MongoDB.client);
        const document = await bookService.create(req.body);
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
        const bookService = new NhanVienService(MongoDB.client);
        const { hotennv } = req.query;
        if (hotennv) {
            documents = await bookService.findByName(hotennv);
        } else {
            documents = await bookService.find({});
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
        const bookService = new NhanVienService(MongoDB.client);
        const document = await bookService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên!"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Lỗi khi truy xuất nhân viên với id= ${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (!req.params.id) {
        return next(new ApiError(400, "Mã số nhân viên không được để trống!"));
    }
    
    try {
        const bookService = new NhanVienService(MongoDB.client);
        const document = await bookService.update(req.params.id, req.body);
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
        const bookService = new NhanVienService(MongoDB.client);
        const document = await bookService.delete(req.params.id);
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

exports.deleteAll = async (_req, res, next) => {
    try {
        const bookService = new NhanVienService(MongoDB.client);
        const deletedCount = await bookService.deleteAll();
        return res.send({
            message: `${deletedCount} nhân viên đã được xóa thành công!`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả nhân viên!")
        );
    }
};
