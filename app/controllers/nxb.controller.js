const NhaXuatBanService = require("../services/nxb.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.manxb) {
        return next(new ApiError(400, "Mã nhà xuất bản không được để trống!"));
    }
    try {
        const nhaxuatbanService = new NhaXuatBanService(MongoDB.client);
        const document = await nhaxuatbanService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo nhà xuất bản!")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    
    try {
        const nhaxuatbanService = new NhaXuatBanService(MongoDB.client);
        const { tennxb } = req.query;
        if (tennxb) {
            documents = await nhaxuatbanService.findByName(tennxb);
        } else {
            documents = await nhaxuatbanService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi truy xuất nhà xuất bản!")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const nhaxuatbanService = new NhaXuatBanService(MongoDB.client);
        const document = await nhaxuatbanService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản!"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Lỗi truy xuất nhà xuất bản với id= ${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (!req.params.id) {
        return next(new ApiError(400, "Mã nhà xuất bản không được trống!"));
    }
    
    try {
        const nhaxuatbanService = new NhaXuatBanService(MongoDB.client);
        const document = await nhaxuatbanService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản!"));
        }
        return res.send({ message: "Nhà xuất bản đã được cập nhật thành công!" });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi cập nhật nhà xuất bản với id=${req.params.id}`)
        );
    }   
};

exports.delete = async (req, res, next) => {
    try {
        const nhaxuatbanService = new NhaXuatBanService(MongoDB.client);
        const document = await nhaxuatbanService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản!"));
        }
        return res.send({ message: "Nhà xuất bản đã được xóa thành công!" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa nhà xuất bản với id=${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const nhaxuatbanService = new NhaXuatBanService(MongoDB.client);
        const deletedCount = await nhaxuatbanService.deleteAll();
        return res.send({
            message: `${deletedCount} nhà xuất bản đã xóa thành công!`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả nhà xuất bản!")
        );
    }
};
