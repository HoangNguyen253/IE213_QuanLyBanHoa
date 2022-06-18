import mongodb from "mongodb";
import express from "express";
import cors from "cors";
import multer from "multer";
import session from "express-session";
import cookieParser from 'cookie-parser';

let app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
let MemoryStore = session.MemoryStore;
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '1234567abc',
    store: new MemoryStore(),
    cookie: { maxAge: 600000 }
})
);

app.get('/', function (req, res) {
    res.send('Chào Các Bạn');
});

const client = new
    mongodb.MongoClient("mongodb+srv://19520182:LeeNguyen253%40%23@nguyen0182cluster.e8kfz.mongodb.net/QuanLyBanHoa?retryWrites=true&w=majority");
async function main() {
    const port = 3008;
    try {
        await client.connect();
        app.listen(port, () => {
            console.log('Server is running on port: ' + port);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    };
}
main().catch(console.error);
let databaseQLBH = client.db("QuanLyBanHoa");
/*START ====================HOA API======================*/

//1. get list hoa
app.get('/api/hoa', async function (req, res) {
    const hoasPerPage = req.query.hoasPerPage ? parseInt(req.query.hoasPerPage) : 4;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const isadminpage = req.query.isAdminPage ? parseInt(req.query.isAdminPage) : 0;

    let filters = {};
    if (req.query.maloaihoa) {
        filters.maloaihoa = req.query.maloaihoa;
    }
    if (req.query.tenhoa) {
        filters.tenhoa = req.query.tenhoa;
    }

    let query;

    if (filters) {
        if (isadminpage == 0) {
            if ("tenhoa" in filters && "maloaihoa" in filters) {
                query = { $text: { $search: filters['tenhoa'] }, "maloaihoa": { $eq: filters['maloaihoa'] * 1 }, soluong: { $ne: 0 } };
            } else {
                if ("tenhoa" in filters) {
                    query = { $text: { $search: filters['tenhoa'] }, soluong: { $ne: 0 } };
                }
                if ("maloaihoa" in filters) {
                    query = { "maloaihoa": { $eq: filters['maloaihoa'] * 1 }, soluong: { $ne: 0 } };
                }
            }
        } else {
            if ("tenhoa" in filters && "maloaihoa" in filters) {
                query = { $text: { $search: filters['tenhoa'] }, "maloaihoa": { $eq: filters['maloaihoa'] * 1 } };
            } else {
                if ("tenhoa" in filters) {
                    query = { $text: { $search: filters['tenhoa'] } };
                }
                if ("maloaihoa" in filters) {
                    query = { "maloaihoa": { $eq: filters['maloaihoa'] * 1 } };
                }
            }
        }
    }

    let cursor;
    let hoas = databaseQLBH.collection("hoa");
    let hoasList = [];
    let totalNumHoas = 0;
    try {
        cursor = await hoas.find(query).limit(hoasPerPage).skip(hoasPerPage * page);
        hoasList = await cursor.toArray();
        totalNumHoas = await hoas.countDocuments(query);
    }
    catch (e) {
        console.error(`Lỗi lấy danh sách hoa, ${e}`);
    }

    let response = {
        isadminpage: isadminpage,
        hoas: hoasList,
        page: page,
        filters: filters,
        entries_per_page: hoasPerPage,
        total_results: totalNumHoas,
    };
    res.json(response);
});

//1.1 get list hoa all
app.get('/api/hoaall', async function (req, res) {
    let cursor;
    let hoas = databaseQLBH.collection("hoa");
    let hoasList = [];
    let totalNumHoas = 0;
    try {
        cursor = await hoas.find();
        hoasList = await cursor.toArray();
        totalNumHoas = await hoas.countDocuments();
    }
    catch (e) {
        console.error(`Lỗi lấy danh sách hoa, ${e}`);
    }

    let response = {
        hoas: hoasList,
        total_results: totalNumHoas
    };
    res.json(response);
});

//2. Insert hoa 
let fileNameUpload;
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './hinhanh');
    },
    filename: function (req, file, cb) {
        fileNameUpload = Date.now() + '-' + file.originalname;
        cb(null, fileNameUpload);
    }
});
let upload = multer({ storage: storage });
app.post('/api/themhoa', upload.single("myFile"), async function (req, res) {
    const tenHoa = req.query.tenHoa;
    const giaTien = req.query.giaTien;
    const moTa = req.query.moTa;
    const soLuong = req.query.soLuong;
    const maLoaiHoa = req.query.maLoaiHoa;
    const file = req.file;
    let response;
    if (tenHoa == null
        || file == null
        || giaTien == null
        || moTa == null
        || soLuong == null
        || maLoaiHoa == null) {
        response = {
            status: false,
            hoa: {
                tenHoa: tenHoa,
                giaTien: giaTien,
                moTa: moTa,
                soLuong: soLuong,
                maLoaiHoa: maLoaiHoa
            },
            file: file
        }
        res.send(response);
    }
    let collectionHoa = databaseQLBH.collection("hoa");
    let obj = {
        tenhoa: tenHoa,
        giatien: giaTien * 1,
        mota: moTa,
        hinhanh: fileNameUpload,
        soluong: soLuong * 1,
        maloaihoa: maLoaiHoa * 1
    }
    try {
        await collectionHoa.insertOne(obj);
        response = {
            status: true,
            hoa: {
                tenHoa: tenHoa,
                giaTien: giaTien,
                moTa: moTa,
                soLuong: soLuong,
                maLoaiHoa: maLoaiHoa
            },
            file: file
        }
        res.send(response);
    } catch (e) {
        console.log('Lỗi insert hoa: ' + e);
        response = {
            status: false,
            hoa: {
                tenHoa: tenHoa,
                giaTien: giaTien,
                moTa: moTa,
                soLuong: soLuong,
                maLoaiHoa: maLoaiHoa
            },
            file: file
        }
        res.send(response);
    }

});

//3. Update hoa - không update ảnh
app.post('/api/suahoa', async function (req, res) {
    const maHoa = req.query.maHoa;
    const tenHoa = req.query.tenHoa;
    const giaTien = req.query.giaTien;
    const moTa = req.query.moTa;
    const soLuong = req.query.soLuong;
    const maLoaiHoa = req.query.maLoaiHoa;
    let response;
    if (tenHoa == null
        || maHoa == null
        || giaTien == null
        || moTa == null
        || soLuong == null
        || maLoaiHoa == null) {
        response = {
            status: false,
            hoa: {
                maHoa: maHoa,
                tenHoa: tenHoa,
                giaTien: giaTien,
                moTa: moTa,
                soLuong: soLuong,
                maLoaiHoa: maLoaiHoa
            }
        }
        res.send(response);
    }

    let hoaCollection = databaseQLBH.collection('hoa');
    const filter = { mahoa: maHoa * 1 };
    const updateDoc = {
        $set: {
            tenhoa: tenHoa,
            giatien: giaTien * 1,
            mota: moTa,
            soluong: soLuong * 1,
            maloaihoa: maLoaiHoa * 1
        }
    }
    try {
        let result = await hoaCollection.updateOne(filter, updateDoc);
        response = {
            status: true,
            hoa: {
                maHoa: maHoa,
                tenHoa: tenHoa,
                giaTien: giaTien,
                moTa: moTa,
                soLuong: soLuong,
                maLoaiHoa: maLoaiHoa
            },
            nModified: result.modifiedCount
        }
        res.send(response);
    }
    catch (e) {
        console.error(`Lỗi sửa hoa, ${e}`);
    }
});

//4. upload image
app.post('/api/uploadhinhanhhoa', upload.single('myFile'), async function (req, res) {
    const file = req.file;
    if (!file) {
        res.send({ status: false, message: "Hãy tải 1 file ảnh" });
    } else {
        res.send({ status: true, message: "Tải ảnh thành công" });
    }
});
//5. lấy hoa theo mã hoa
app.get('/api/gethoabyma', async function (req, res) {
    const maHoa = req.query.maHoa;
    let response;
    if (maHoa == null) {
        response = {
            status: false,
            maHoa: maHoa
        }
        res.send(response);
    }
    const hoaCollection = databaseQLBH.collection("hoa");
    let query = { mahoa: { $eq: maHoa * 1 } };
    try {
        let cursor = await hoaCollection.find(query);
        let listHoa = await cursor.toArray();
        if (listHoa.length != 0) {
            let result = listHoa[0];
            response = {
                status: true,
                maHoa: maHoa,
                hoa: result
            }
            res.send(response);
        } else {
            response = {
                status: false,
                error: "Mã hoa không tồn tại"
            }
            res.send(response);
        }
    }
    catch (e) {
        response = {
            status: false,
            maHoa: maHoa,
            error: e
        }
        res.send(response);
    }
});
/*END ====================HOA API======================*/

/*START ====================LOAIHOA API======================*/
//1. Thêm loại hoa
app.post('/api/themloaihoa', async function (req, res) {
    const tenLoaiHoa = req.query.tenLoaiHoa;
    let response;
    if (tenLoaiHoa == null) {
        response = {
            status: false,
            tenLoaiHoa: tenLoaiHoa
        }
        res.send(response);
    }

    const loaihoaCollection = databaseQLBH.collection("loaihoa");
    let obj = { tenloaihoa: tenLoaiHoa };
    try {
        await loaihoaCollection.insertOne(obj);
        response = {
            status: true,
            tenLoaiHoa: tenLoaiHoa
        }
        res.send(response);
    } catch (e) {
        response = {
            status: false,
            tenLoaiHoa: tenLoaiHoa,
            error: e
        }
        res.send(response);
    }
});

//2. Sửa loại hoa
app.post('/api/sualoaihoa', async function (req, res) {
    const maLoaiHoa = req.query.maLoaiHoa;
    const tenLoaiHoa = req.query.tenLoaiHoa;
    let response;
    if (maLoaiHoa == null || tenLoaiHoa == null) {
        response = {
            status: false,
            loaiHoa: {
                maLoaiHoa: maLoaiHoa,
                tenLoaiHoa: tenLoaiHoa
            }
        };
        res.send(response);
    }

    const loaihoaCollection = databaseQLBH.collection("loaihoa");
    let filter = { maloaihoa: { $eq: maLoaiHoa * 1 } };
    let updateDoc = {
        $set: {
            tenloaihoa: tenLoaiHoa
        }
    }
    try {
        let result = await loaihoaCollection.updateOne(filter, updateDoc);
        response = {
            status: true,
            loaiHoa: {
                maloaihoa: maLoaiHoa,
                tenloaihoa: tenLoaiHoa
            },
            nModified: result.modifiedCount
        };
        res.send(response);
    } catch (e) {
        response = {
            status: false,
            loaiHoa: {
                maLoaiHoa: maLoaiHoa,
                tenLoaiHoa: tenLoaiHoa
            },
            error: e
        };
        res.send(response);
    }
});

//3. get list loại hoa theo trang
app.get('/api/getloaihoa', async function (req, res) {
    const loaiHoaPerPage = (req.query.loaiHoaPerPage) ? parseInt(req.query.loaiHoaPerPage) : 4;
    const page = (req.query.page) ? parseInt(req.query.page) : 0;

    let response;
    let loaihoaCollection = databaseQLBH.collection("loaihoa");

    try {
        let cursor = await loaihoaCollection.find().limit(loaiHoaPerPage).skip(page * loaiHoaPerPage);
        let listLoaiHoa = await cursor.toArray();
        let total_results = await loaihoaCollection.countDocuments();
        response = {
            status: true,
            listLoaiHoa: listLoaiHoa,
            page: page,
            loaiHoaPerPage: loaiHoaPerPage,
            total_results: total_results
        }
        res.send(response);
    } catch (e) {
        response = {
            status: false,
            page: page,
            loaiHoaPerPage: loaiHoaPerPage,
            error: e
        }
        res.send(response);
    }
});

//4. get list loại hoa all (dành cho chọn loại hoa khi thêm hoa)
app.get('/api/loaihoaall', async function (req, res) {
    let response;
    const loaihoaCollection = databaseQLBH.collection("loaihoa");
    try {
        let dslh = await loaihoaCollection.find().toArray();
        let total_results = await loaihoaCollection.countDocuments();
        response = {
            status: true,
            listLoaiHoa: dslh,
            total_results: total_results
        }
        res.send(response);
    } catch (e) {
        response = {
            status: false,
            error: e
        }
        res.send(response);
    }
});

//5. Get chi tiết mã loại theo mã
app.get('/api/getloaihoabyma', async function (req, res) {
    const maLoaiHoa = req.query.maLoaiHoa;
    let response;
    if (maLoaiHoa == null) {
        response = {
            status: false,
            error: "Hãy nhập mã loại hoa"
        }
        res.send(response);
    } else {
        const loaihoaCollection = databaseQLBH.collection("loaihoa");
        let query = { maloaihoa: { $eq: maLoaiHoa * 1 } };
        try {
            let cursor = await loaihoaCollection.find(query);
            let listLoaiHoa = await cursor.toArray();
            if (listLoaiHoa.length != 0) {
                let result = listLoaiHoa[0];
                response = {
                    status: true,
                    loaiHoa: result
                }
                res.send(response);
            } else {
                response = {
                    status: false,
                    error: "Mã loại hoa không tồn tại."
                }
                res.send(response);
            }
        } catch (e) {
            response = {
                status: false,
                error: e
            }
            res.send(response);
        }
    }
});

/*END ====================LOAIHOA API======================*/

/*START ====================NGUOIDUNG API======================*/
//1. Thêm khách hàng (đăng ký) chỉ là khách hàng
app.post('/api/themnguoidung', async function (req, res) {
    const tenDangNhap = req.query.tenDangNhap;
    const matKhau = req.query.matKhau;
    const hoTen = req.query.hoTen;
    const soDienThoai = req.query.soDienThoai;
    const diaChi = req.query.diaChi;
    const email = req.query.email;

    let response;
    if (tenDangNhap == null
        || matKhau == null
        || hoTen == null
        || soDienThoai == null
        || diaChi == null
        || email == null) {
        response = {
            status: false,
            nguoiDung: {
                tenDangNhap: tenDangNhap,
                matKhau: matKhau,
                hoTen: hoTen,
                soDienThoai: soDienThoai,
                diaChi: diaChi,
                email: email
            },
            error: "Hãy điền đầy đủ các trường"
        }
        res.send(response);
    }

    const nguoiDungCollection = databaseQLBH.collection("nguoidung");
    let obj = {
        tendangnhap: tenDangNhap,
        matkhau: matKhau,
        hoten: hoTen,
        sodienthoai: soDienThoai,
        diachi: diaChi,
        email: email,
        maloainguoidung: 2
    };
    try {
        await nguoiDungCollection.insertOne(obj);
        response = {
            status: true,
            nguoiDung: obj
        }
        res.send(response);
    } catch (e) {
        response = {
            status: false,
            nguoidung: obj,
            error: e
        }
        res.send(response);
    }
});

//2. Check tên đăng nhập
app.get('/api/checktendangnhap', async function (req, res) {
    const tenDangNhap = req.query.tenDangNhap;
    let response;
    if (tenDangNhap == null) {
        response = {
            status: false,
            tenDangNhap: tenDangNhap,
            error: "Hãy nhập tên đăng nhập"
        }
        res.send(response);
    }

    const nguoiDungCollection = databaseQLBH.collection("nguoidung");
    let query = { tendangnhap: { $eq: tenDangNhap } };
    try {
        let cursor = await nguoiDungCollection.find(query);
        let listNguoiDung = await cursor.toArray();
        if (listNguoiDung.length != 0) {
            response = {
                status: true,
                hasUser: true
            }
            res.send(response);
        } else {
            response = {
                status: true,
                hasUser: false
            }
            res.send(response);
        }

    } catch (e) {
        response = {
            status: false,
            error: e
        }
        res.send(response);
    }
});

//3. Login
app.use('/api/login', async function (req, res) {
    const tenDangNhap = req.query.tenDangNhap;
    const matKhau = req.query.matKhau;

    let response;
    if (tenDangNhap == null || matKhau == null) {
        response = {
            status: false,
            login: {
                tenDangNhap: tenDangNhap,
                matKhau
            },
            error: "Hãy nhập đầy đủ trường"
        };
        res.send(response);
    }

    const nguoiDungCollection = databaseQLBH.collection("nguoidung");
    try {
        let query = {
            tendangnhap: { $eq: tenDangNhap },
            matkhau: { $eq: matKhau }
        }
        let cursor = await nguoiDungCollection.find(query);
        let listNguoiDung = await cursor.toArray();
        if (listNguoiDung.length != 0) {
            let nguoiDung = listNguoiDung[0];
            req.session.nguoiDung = nguoiDung;
            response = {
                status: true,
                nguoiDung: nguoiDung,
                success: true
            }
            res.send(response);
        } else {
            response = {
                status: true,
                success: false,
                error: "Đăng nhập thất bại"
            }
            res.send(response);
        }
    } catch (e) {
        response = {
            status: true,
            success: false,
            error: e
        }
        res.send(response);
    }
});

//4. Get khách hàng từ session (dành cho trang sửa thông tin cá nhân)
app.get('/api/getnguoidungsession', async function (req, res) {
    let response;
    if (req.session.nguoiDung == undefined) {
        response = {
            status: false,
            error: "Chưa có người dùng đăng nhập"
        };
        res.send(response);
    } else {
        response = {
            status: true,
            nguoiDung: req.session.nguoiDung
        };
        res.send(response);
    }
})

//5. logout
app.get("/api/logout", async function (req, res) {
    try {
        req.session.nguoiDung = undefined;
        res.send({
            status: true,
            message: "Bạn đã đăng xuất"
        });
    } catch (e) {
        res.send({
            status: false,
            message: "Đăng xuất thất bại",
            error: e
        });
    }

});

//6. Sửa thông tin cá nhân
app.post('/api/suanguoidung', async function (req, res) {
    const tenDangNhap = req.query.tenDangNhap;
    const matKhau = req.query.matKhau;
    const hoTen = req.query.hoTen;
    const soDienThoai = req.query.soDienThoai;
    const diaChi = req.query.diaChi;
    const email = req.query.email;

    let response;
    if (tenDangNhap == null
        || matKhau == null
        || hoTen == null
        || soDienThoai == null
        || diaChi == null
        || email == null) {
        response = {
            status: false,
            nguoiDung: {
                tenDangNhap: tenDangNhap,
                matKhau: matKhau,
                hoTen: hoTen,
                soDienThoai: soDienThoai,
                diaChi: diaChi,
                email: email
            },
            error: "Hãy điền đầy đủ các trường"
        }
        res.send(response);
    }

    const nguoiDungCollection = databaseQLBH.collection("nguoidung");
    let filter = { tendangnhap: { $eq: tenDangNhap } };
    let updateDoc = {
        $set: {
            matkhau: matKhau,
            hoten: hoTen,
            sodienthoai: soDienThoai,
            diachi: diaChi,
            email: email,
            maloainguoidung: 2
        }
    };
    try {
        let result = await nguoiDungCollection.updateOne(filter, updateDoc);
        response = {
            status: true,
            nModified: result.modifiedCount,
            message: "Sửa thông tin thành công"
        }
        res.send(response);
    } catch (e) {
        response = {
            status: false,
            error: e
        }
        res.send(response);
    }
});

/*END ====================NGUOIDUNG API======================*/

/*START ====================GIOHANG API======================*/
app.post('/api/themhoavaogiohang', async function (req, res) {
    const maHoa = req.query.maHoa;
    const soLuong = req.query.soLuong;

    let response;
    if (maHoa == null || soLuong == null) {
        response = {
            status: false,
            error: "Thiếu trường mã hoa hoặc số lượng"
        }
        res.send(response);
    } else {
        const hoaCollection = databaseQLBH.collection("hoa");
        try {
            let query = { mahoa: { $eq: maHoa * 1 } };
            let cursor = await hoaCollection.find(query);
            let listHoa = await cursor.toArray();
            let soLuongAvailable = (listHoa[0]).soluong;

            if (req.session.gioHang == undefined) {
                if (soLuongAvailable * 1 < soLuong * 1) {
                    response = {
                        status: true,
                        add: false,
                        error: "Số lượng có sẵn không đủ để đáp ứng"
                    };
                    res.send(response);
                } else {
                    req.session.gioHang = [];
                    let myItem = { maHoa: maHoa * 1, soLuong: soLuong * 1 };
                    (req.session.gioHang).push(myItem);
                    response = {
                        status: true,
                        add: true,
                        message: "Thêm vào giỏ hàng thành công"
                    };
                    res.send(response);
                }
            } else {
                let gioHang = req.session.gioHang;
                let lengthGioHang = gioHang.length;
                let iFind = -1;
                for (let i = 0; i < lengthGioHang; i++) {
                    if (gioHang[i].maHoa == maHoa) {
                        iFind = i;
                        break;
                    }
                }
                if (iFind == -1) {
                    let myItem = { maHoa: maHoa * 1, soLuong: soLuong * 1 };
                    (req.session.gioHang).push(myItem);
                    response = {
                        status: true,
                        add: true,
                        error: "Thêm vào giỏ hàng thành công"
                    };
                    res.send(response);
                } else {
                    if ((req.session.gioHang)[iFind].soLuong * 1 + soLuong * 1 > soLuongAvailable * 1) {
                        response = {
                            status: true,
                            add: false,
                            error: "Số lượng có sẵn không đủ để đáp ứng"
                        };
                        res.send(response);
                    } else {
                        (req.session.gioHang)[iFind].soLuong += (soLuong * 1);
                        response = {
                            status: true,
                            add: true,
                            error: "Thêm vào giỏ hàng thành công"
                        };
                        res.send(response);
                    }
                }
            }
        } catch (e) {
            response = {
                status: false,
                error: e
            };
            res.send(response);
        }
    }
});

//2. Get list hoa trong giỏ
app.get('/api/giohang', async function (req, res) {
    let response;
    try {
        response = {
            status: true,
            gioHang: (req.session.gioHang) || []
        }
        res.send(response);
    } catch (e) {
        response = {
            status: false,
            error: e
        };
        res.send(response);
    }
});

//3. Cập nhật giỏ hàng
app.post('/api/capnhatgiohang', async function (req, res) {
    let response;
    try {
        let gioHangNew = req.body;
        let gioHangCur = [];
        if (gioHangNew) {
            const hoaCollection = databaseQLBH.collection("hoa");
            let isOver = -1;
            let amountAvailable = -1;
            let amountRequest = -1;
            let lengthGioHangNew = gioHangNew.length;
            let cursor = await hoaCollection.find();
            let listHoa = await cursor.toArray();
            for (let i = 0; i < lengthGioHangNew; i++) {
                let soLuongAvailable = 0;
                for (let j = 0; j < listHoa.length; j++) {
                    if (gioHangNew[i].maHoa == listHoa[j].mahoa) {
                        soLuongAvailable = listHoa[j].soluong;
                    }
                }
                if (gioHangNew[i].soLuong * 1 > soLuongAvailable * 1) {
                    isOver = gioHangNew[i].maHoa;
                    amountAvailable = soLuongAvailable;
                    amountRequest = gioHangNew[i].soLuong;
                    break;
                } else {
                    gioHangCur.push(gioHangNew[i]);
                }
            }
            if (isOver * 1 == -1) {
                req.session.gioHang = gioHangCur;
                response = {
                    status: true,
                    message: "Cập nhật thành công"
                };
                res.send(response);
            } else {
                response = {
                    status: false,
                    message: "Mã hoa có số lượng có sẵn",
                    maHoa: isOver * 1,
                    available: amountAvailable * 1,
                    request: amountRequest * 1
                };
                res.send(response);
            }
        }
    } catch (e) {
        response = {
            status: false,
            message: "Cập nhật thất bại",
            error: e
        };
        res.send(response);
    }
});


/*END ====================GIOHANG API======================*/

/*START ====================DONHANG API======================*/
//1. Thêm đơn hàng -> Thanh toán
app.post('/api/thanhtoan', async function (req, res) {
    const donHang = req.body;
    const diaChi = donHang.diaChi;
    const tongTien = donHang.tongTien;
    const ctdh = donHang.ctdh;

    const donHangCollection = databaseQLBH.collection("donhang");
    let response;
    try {
        if (req.session.nguoiDung == undefined) {
            response = {
                status: false,
                error: "Chưa đăng nhập"
            }
            res.send(response);
        } else {
            let time = new Date();
            let timeString = time.getFullYear() + "-" +
                (time.getMonth() + 1) + "-" +
                time.getDate() + "T" +
                time.getHours() + ":" +
                time.getMinutes() + ":" +
                time.getSeconds();
            let donHangOBJ = {
                tendangnhap: req.session.nguoiDung.tendangnhap,
                diachi: diaChi,
                tongtien: tongTien * 1,
                thoigiandat: timeString,
                trangthai: 1,
                ctdh: ctdh
            }
            await donHangCollection.insertOne(donHangOBJ);
            response = {
                status: true,
                message: "Thanh toán thành công"
            }
            res.send(response);
        }

    } catch (e) {
        response = {
            status: false,
            error: e
        }
        res.send(response);
    }
});

//2. Get list đơn hàng theo trang
app.get('/api/quanlydonhang', async function (req, res) {
    const donhangPerPage = req.query.donhangPerPage ? parseInt(req.query.donhangPerPage) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 0;

    let query;
    if (req.query.trangThai) {
        query = {trangthai : {$eq: req.query.trangThai*1}}
    }

    let cursor;
    let donHangCollection = databaseQLBH.collection("donhang");
    let donHangList = [];
    let totalNumDonHang = 0;
    try {
        cursor = await donHangCollection.find(query).limit(donhangPerPage).skip(donhangPerPage * page);
        donHangList = await cursor.toArray();
        totalNumDonHang = await donHangCollection.countDocuments(query);
    }
    catch (e) {
        console.error(`Lỗi lấy danh sách hoa, ${e}`);
    }

    let response = {
        donHangList: donHangList,
        page: page,
        trangThai: req.query.trangThai,
        entries_per_page: donhangPerPage,
        total_results: totalNumDonHang,
    };
    res.json(response);
});

//3. Sửa đơn hàng: Trạng thái(1: vừa đặt, 2: hủy đơn, 3: đang giao, 4: hoàn thành)
app.post('/api/suadonhang', async function (req, res) {
    const maDonHang = req.query.maDonHang;
    const trangThaiMoi = req.query.trangThai;

    let response;
    if (maDonHang== null || trangThaiMoi == null) {
        response = {
            status: false,
            error: "Hãy nhập đầy đủ các trường"
        };
        res.send(response);
    } else {
        const donHangCollection = databaseQLBH.collection("donhang");
        let filter = {madonhang: {$eq: maDonHang*1}};
        let updateDoc = {
            $set: {
                trangthai: trangThaiMoi*1
            }
        }
        try {
            await donHangCollection.updateOne(filter, updateDoc);
            response = {
                status: true,
                message: "Sửa trạng thái thành công"
            }; 
            res.send(response);
        } catch(e) {
            response = {
                status: false,
                error: e
            }; 
            res.send(response);
        }
    }
});

//4. Get chi tiết đơn hàng từ mã đơn hàng
app.get('/api/chitietdonhang', async function(req, res) {
    const maDonHang = req.query.maDonHang;

    let response;
    if (maDonHang == null) {
        response = {
            status: false,
            error: "Nhập mã đơn hàng"
        }; 
        res.send(response);
    } else {
        try {
            const donHangCollection = databaseQLBH.collection("donhang");
            let query = {madonhang: {$eq: maDonHang*1}};
            let donHang = await donHangCollection.findOne(query);
            if (donHang == null) {
                response = {
                    status: false,
                    error: "Mã đơn hàng không tồn tại"
                }; 
                res.send(response);
            } else {
                response = {
                    status: true,
                    donHang: donHang
                }; 
                res.send(response);
            }
        } catch(e) {
            response = {
                status: false,
                error: e
            }; 
            res.send(response);
        }
        
    }
});

//5. Get list đơn hàng theo trang, tên đăng nhập (dành cho theo dõi các đơn hàng của 1 khách)
app.get('/api/donhangnguoidung', async function (req, res) {
    const donhangPerPage = req.query.donhangPerPage ? parseInt(req.query.donhangPerPage) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 0;

    let response;
    if (req.session.nguoiDung == undefined) {
        response = {
            status: false,
            error: "Chưa đăng nhập"
        }; 
        res.send(response);
    } else {
        let query = {tendangnhap : {$eq: req.session.nguoiDung.tendangnhap}}
    
        let cursor;
        let donHangCollection = databaseQLBH.collection("donhang");
        let donHangList = [];
        let totalNumDonHang = 0;
        try {
            cursor = await donHangCollection.find(query).limit(donhangPerPage).skip(donhangPerPage * page);
            donHangList = await cursor.toArray();
            totalNumDonHang = await donHangCollection.countDocuments(query);
        }
        catch (e) {
            console.error(`Lỗi lấy danh sách hoa, ${e}`);
        }
    
        response = {
            donHangList: donHangList,
            page: page,
            tenDangNhap: req.session.nguoiDung.tendangnhap,
            entries_per_page: donhangPerPage,
            total_results: totalNumDonHang,
        };
        res.json(response);
    }   
});

/*END ====================DONHANG API======================*/
app.use('*', (req, res) => {
    res.status(404).json({ error: "not found" });
});
export default app;