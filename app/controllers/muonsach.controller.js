const MuonSachService = require("../services/muonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.madocgia) {
        return next(new ApiError(400, "Mã đọc giả không được để trống!"));
    }
    if (!req.body?.masach) {
        return next(new ApiError(400, "Mã sách không được để trống!"));
    }
    if (!req.body?.ngaymuon) {
        return next(new ApiError(400, "Ngày mượn không được để trống!"));
    }
    try {
        const muonsachService = new MuonSachService(MongoDB.client);
        const document = await muonsachService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo theo dõi mượn sách!")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    
    try {
        const muonsachService = new MuonSachService(MongoDB.client);
        const { tensach } = req.query;
        if (tensach) {
            documents = await muonsachService.findByName(tensach);
        } else {
            documents = await muonsachService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi truy xuất danh sách theo dõi mượn sách!")
        );
    }

    return res.send(documents);
};
exports.getAllReader = async (req, res, next) => {
    let documents = [];
    
    try {
        const muonsachService = new MuonSachService(MongoDB.client);
        const { madocgia } = req.query;
        if (madocgia) {
            documents = await muonsachService.findByName(madocgia);
        } else {
            documents = await muonsachService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi truy xuất danh sách theo dõi mượn sách!")
        );
    }

    return res.send(documents);
};
exports.findOne = async (req, res, next) => {
    try {
        const muonsachService = new MuonSachService(MongoDB.client);
        const document = await muonsachService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy theo dõi mượn sách!"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Lỗi khi truy xuất theo dõi mượn sách với id= ${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (!req.params.id) {
        return next(new ApiError(400, "Mã theo dõi mượn sách không được để trống!"));
    }
    
    try {
        const muonsachService = new MuonSachService(MongoDB.client);
        const document = await muonsachService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy theo dõi mượn sách!"));
        }
        return res.send({ message: "Theo dõi mượn sách đã được cập nhật thành công!" });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi cập nhật theo dõi mượn sách với id=${req.params.id}`)
        );
    }   
};

exports.delete = async (req, res, next) => {
    try {
        const muonsachService = new MuonSachService(MongoDB.client);
        const document = await muonsachService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy theo dõi mượn sách!"));
        }
        return res.send({ message: "Theo dõi mượn sách đã được xóa thành công!" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa theo dõi mượn sách với id=${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const muonsachService = new MuonSachService(MongoDB.client);
        const deletedCount = await muonsachService.deleteAll();
        return res.send({
            message: `${deletedCount} theo dõi mượn sách đã được xóa thành công!`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả theo dõi mượn sách!")
        );
    }
};
