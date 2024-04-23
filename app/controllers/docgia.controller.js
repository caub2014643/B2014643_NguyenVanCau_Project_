const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.madocgia) {
        return next(new ApiError(400, "Mã đọc giả không được để trống!"));
    }
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo đọc giả!")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const { ten } = req.query;
        if (ten) {
            documents = await docgiaService.findByName(ten);
        } else {
            documents = await docgiaService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi truy xuất đọc giả!")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.findById(req.params.madocgia);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy đọc giả!"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Lỗi khi truy xuất đọc giả với id= ${req.params.madocgia}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (!req.params.id) {
        return next(new ApiError(400, "Mã đọc giả không được để trống!"));
    }
    
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy thông tin đọc giả!"));
        }
        return res.send({ message: "Thông tin đọc giả đã được cập nhật thành công!" });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi cập nhật thông tin đọc giả với id=${req.params.id}`)
        );
    }   
};

exports.delete = async (req, res, next) => {
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy thông tin đọc giả!"));
        }
        return res.send({ message: "Thông tin đọc giả đã được xóa thành công!" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa đọc giả với id=${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const deletedCount = await docgiaService.deleteAll();
        return res.send({
            message: `${deletedCount} đọc giả đã được xóa thành công!`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả đọc giả!")
        );
    }
};

exports.login = async (req, res, next) => {
    const { madocgia, dienthoai } = req.body;

    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const result = await docgiaService.login(madocgia, dienthoai);

        if (!result) {
            // Trường hợp xác thực không thành công, trả về lỗi
            return next(new ApiError(401, result.message));
        }

        return res.send(result.docGia);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xác thực người dùng!")
        );
    }
};
