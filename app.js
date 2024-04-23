const express = require("express");
const cors = require("cors");

const booksRouter = require("./app/routes/book.route");
const nhaxuatbanRouter = require("./app/routes/nxb.route");
const muonsachRouter = require("./app/routes/muonsach.route");
const docgiaRouter = require("./app/routes/docgia.route");
const nhanvienRouter = require("./app/routes/nhanvien.route");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Chào mừng bạn đến với ứng dụng quản lý sách." });
});

app.use("/api/books", booksRouter);
app.use("/api/nhaxuatban", nhaxuatbanRouter);
app.use("/api/muonsach", muonsachRouter);
app.use("/api/docgia", docgiaRouter);
app.use("/api/nhanvien", nhanvienRouter);

// handle 404 response
app.use((req, res, next) => {
    // Code ở đây sẽ chạy khi không có route được định nghĩa nào
    // khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
    return next(new ApiError(404, "Không tìm thấy tài nguyên!"));
});
    // define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
    // Middleware xử lý lỗi tập trung.
    // Trong các đoạn code xử lý ở các route, gọi next(error)
    // sẽ chuyển về middleware xử lý lỗi này
    return res.status(err.statusCode || 500).json({
        message: err.message || "Lỗi máy chủ nội bộ",
    });
});
module.exports = app;