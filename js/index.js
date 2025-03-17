
let currentPage = 1; // Trang hiện tại
const itemsPerPage = 5; // Số phần tử mỗi trang

//Khi ấn started
function scrollToForm() {
    $('html, body').animate({
        scrollTop: $("#buoc1").offset().top
    }, 500); // 1000ms = 1 giây
}
//Khi ấn Xác nhận
function scrollToTable() {
    $('html, body').animate({
        scrollTop: $("#contentTable").offset().top
    }, 1000); // 1000ms = 1 giây
}

// Bật các trường nhập liệu khi nhấn nút "Sửa thông tin"
document.getElementById('editBtn').addEventListener('click', function () {
    document.getElementById('hoTenHocVien').disabled = false;
    document.getElementById('sdtHocVien').disabled = false;
    document.getElementById('emailHocVien').disabled = false;
});

const apiToken = "45UUXAPg34nKjGVdMpss7iwhccn7xPg4corm_X1c";

const pageSize = 100;
let studentsList = [];

async function updateStudentData(data) {
    const updateUrl = `https://noco-erp.com/api/v2/tables/m6whmcc44o8tgh8/records`;
    const response = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'xc-token': apiToken
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Error updating student: ${response.status} ${response.statusText} - ${errorMsg}`);
    }

    const result = await response.json();
    return result;

}

async function updateClassSP(data) {
    const updateUrl = `https://noco-erp.com/api/v2/tables/myepkgaw4gfdb0l/records`;
    const response = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'xc-token': apiToken
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Error updating student: ${response.status} ${response.statusText} - ${errorMsg}`);
    }

    const result = await response.json();
    return result;

}

async function fetchData() {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id');

    if (studentId) {
        const baseUrl = `https://noco-erp.com/api/v2/tables/m6whmcc44o8tgh8/records?where=(studentId,allof,${studentId})`;

        const checkResponse = await fetch(baseUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'xc-token': apiToken
            }
        });

        if (!checkResponse.ok) {
            console.error(`Error checking studentId: ${checkResponse.status} ${checkResponse.statusText}`);
            return [];
        }

        const loadingElement = document.getElementById('loading');
        loadingElement.style.display = 'flex'; // Hiển thị màn chờ

        const checkData = await checkResponse.json();

        if (checkData.list.length > 0) {
            const studentData = checkData.list[0];
            fillForm(studentData);

            // Lấy thông tin mã lớp và lịch học từ dữ liệu học viên
            const maLop = studentData.maLop;
            const lichHoc = studentData.lichHoc;
            const ngayKhaiGiangDuKien = studentData.ngayKhaiGiangDuKien;
            const maLopBanGiao = studentData.maLopBanGiao;

            // Kiểm tra nếu đã có mã lớp đăng ký
            if (maLop && lichHoc && ngayKhaiGiangDuKien) {
                displayRegisteredSchedule(maLop, lichHoc, ngayKhaiGiangDuKien);
                document.getElementById('thongBaoLich').innerText = 'BẠN ĐÃ ĐĂNG KÝ LỊCH HỌC';
                document.getElementById('registrationMessage').style.display = 'block';
                loadingElement.style.display = 'none'; // Ẩn màn chờ
                return;
            }

            // Nếu chưa đăng ký mã lớp nào, kiểm tra mã bàn giao
            if (maLopBanGiao) {
                const result = await fetchMaLopBanGiao(maLopBanGiao);
                if (result) {
                    const { maLop: banGiaoMaLop, lichHoc: banGiaoLichHoc, ngayKhaiGiang: banGiaoNgayKhaiGiang } = result;
                    displayForm(banGiaoMaLop, banGiaoLichHoc, banGiaoNgayKhaiGiang);
                }
                loadingElement.style.display = 'none'; // Ẩn màn chờ
                return;
            }
        }

        loadingElement.style.display = 'none'; // Ẩn màn chờ nếu không có dữ liệu
    }

    return []; // Trả về toàn bộ dữ liệu học viên nếu không có điều kiện lọc
}

// Hàm để điền dữ liệu vào form
function fillForm(student) {
    if (student) {
        document.getElementById('Id').value = student.Id || ''; // Điền ID
        // Điền các trường khác tương tự
        document.getElementById('studentId').value = student.studentId || '';
        document.getElementById('maTheoDoi').value = student.maTheoDoi || '';
        document.getElementById('maDonHang').value = student.maDonHang || '';
        document.getElementById('hoTenHocVien').value = student.hoTenHocVien || '';
        document.getElementById('sdtHocVien').value = student.sdtHocVien || '';
        document.getElementById('emailHocVien').value = student.emailHocVien || '';
        document.getElementById('tenSanPham').value = student.tenSanPham || '';
        document.getElementById('trinhDo').value = student.trinhDo || '';
        document.getElementById('size').value = student.size || '';
        document.getElementById('loaiGiaoVien').value = student.loaiGiaoVien || '';
        document.getElementById('soBuoi').value = student.soBuoi || '';
        document.getElementById('giaThucDong').value = student.giaThucDong || '';
        document.getElementById('hoTenDaiDien').value = student.hoTenDaiDien || '';
        document.getElementById('sdtDaiDien').value = student.sdtDaiDien || '';
        document.getElementById('emailDaiDien').value = student.emailDaiDien || '';
        document.getElementById('maLop').value = student.maLop || '';
        document.getElementById('lichHoc').value = student.lichHoc || '';
        document.getElementById('ngayKhaiGiangDuKien').value = student.ngayKhaiGiangDuKien || '';
        document.getElementById('maLopSW').value = student.maLopSW || '';
        document.getElementById('maLopBanGiao').value = student.maLopBanGiao || '';
    }
}

fetchData();


// Kiểm tra dữ liệu và hiển thị hộp thoại xác nhận bằng SweetAlert2 khi nhấn nút "Xác nhận thông tin"
document.getElementById('confirmBtn').addEventListener('click', function () {
    var hoTen = document.getElementById('hoTenHocVien').value.trim();
    var sdt = document.getElementById('sdtHocVien').value.trim();
    var email = document.getElementById('emailHocVien').value.trim();
    var hoTenDaiDien = document.getElementById('hoTenDaiDien').value.trim();
    var sdtDaiDien = document.getElementById('sdtDaiDien').value.trim();
    var emailDaiDien = document.getElementById('emailDaiDien').value.trim();
    // Regex kiểm tra số điện thoại Việt Nam (10 đến 11 số, bắt đầu bằng 0)
    var phoneRegex = /^0\d{9,10}$/;

    // Regex kiểm tra email
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Kiểm tra nếu có trường nào bị trống
    if (!hoTen || !sdt || !email || !hoTenDaiDien || !sdtDaiDien || !emailDaiDien) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không được để trống thông tin!'
        });
    } 
    // else if (!phoneRegex.test(sdt) || !phoneRegex.test(sdtDaiDien)) {
    //     Swal.fire({
    //         icon: 'error',
    //         title: 'Lỗi',
    //         text: 'Số điện thoại không đúng định dạng! Vui lòng nhập lại.'
    //     });
    // } 
    else if (!emailRegex.test(email) || !emailRegex.test(emailDaiDien)) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Email không đúng định dạng! Vui lòng nhập đúng định dạng email.'
        });
    } else {
        // Hiển thị hộp thoại xác nhận
        Swal.fire({
            title: 'Bạn có chắc chắn xác nhận thông tin không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Xác nhận thành công!', '', 'success');

                var updatedData = {
                    Id: document.getElementById('Id').value.trim(),
                    studentId: document.getElementById('studentId').value.trim(),
                    maTheoDoi: document.getElementById('maTheoDoi').value.trim(),
                    maDonHang: document.getElementById('maDonHang').value.trim(),
                    hoTenHocVien: document.getElementById('hoTenHocVien').value,
                    sdtHocVien: document.getElementById('sdtHocVien').value,
                    emailHocVien: document.getElementById('emailHocVien').value,
                    trinhDo: document.getElementById('trinhDo').value,
                    tenSanPham: document.getElementById('tenSanPham').value,
                    size: document.getElementById('size').value,
                    loaiGiaoVien: document.getElementById('loaiGiaoVien').value,
                    soBuoi: document.getElementById('soBuoi').value || 0,
                    giaThucDong: document.getElementById('giaThucDong').value || 0,
                    hoTenDaiDien: document.getElementById('hoTenDaiDien').value,
                    sdtDaiDien: document.getElementById('sdtDaiDien').value,
                    emailDaiDien: document.getElementById('emailDaiDien').value,
                };

                // Gọi hàm cập nhật dữ liệu
                updateStudentData(updatedData).then(() => {

                    document.getElementById('contentTable').style.display = 'block';
                    fetchData()
                    fetchAndCompareData(false);
                    scrollToTable();

                    // Update progress indicator
                    document.getElementById('step1').classList.add('completed');
                    document.getElementById('step2').classList.add('active');
                });
            }
        });
    }
});


async function fetchDataLopHoc(Product, Size, Level, Teacher_type) {

    const baseUrlLopHoc = `https://noco-erp.com/api/v2/tables/mhh0jrb11ycvfzg/records?where=((soSlotConLai,lt,0)~and(Product,allof,${Product})~and(Size,allof,${Size})~and(Level,allof,${Level})~and(Teacher_type,allof,${Teacher_type})~and((Status,allof,Dự kiến khai giảng)~or(Status,allof,Chốt khai giảng)))`;
    
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'flex'; // Hiển thị màn chờ
    const response = await fetch(baseUrlLopHoc, {
        method: 'GET',
        headers: {
            'xc-token': apiToken,
            'Content-Type': 'application/json'
        }
    });
    loadingElement.style.display = 'none'; // Ẩn màn chờ
    return response.json(); // Trả về toàn bộ dữ liệu đã lọc

}



async function timLopHoc(maLop) {
    const baseUrlLopHoc = `https://noco-erp.com/api/v2/tables/mhh0jrb11ycvfzg/records?where=(Classcode,allof,${maLop})`;
    const response = await fetch(baseUrlLopHoc, {
        method: 'GET',
        headers: {
            'xc-token': apiToken,
            'Content-Type': 'application/json'
        }
    });
    return response.json(); // Trả về toàn bộ dữ liệu đã lọc
}

async function updateLopHoc(data) {
    const updateUrl = `https://noco-erp.com/api/v2/tables/mhh0jrb11ycvfzg/records`;
    const response = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'xc-token': apiToken
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Error updating student: ${response.status} ${response.statusText} - ${errorMsg}`);
    }

    const result = await response.json();
    return result;

}

async function fetchAndCompareData(quayVe) {
    const tenSanPham = document.getElementById('tenSanPham').value;
    const trinhDo = document.getElementById('trinhDo').value;
    const size = document.getElementById('size').value;
    const maLop = document.getElementById('maLop').value;
    const lichHoc = document.getElementById('lichHoc').value;
    const ngayKhaiGiangDuKien = document.getElementById('ngayKhaiGiangDuKien').value;
    const loaiGiaoVien = document.getElementById('loaiGiaoVien').value;
    const maLopBanGiao = document.getElementById('maLopBanGiao').value; // Lấy mã bàn giao
    console.log(maLopBanGiao);
    
    const loadingElement = document.getElementById('loading');

    loadingElement.style.display = 'flex'; // Hiển thị màn chờ

    // Kiểm tra nếu đã có mã lớp đăng ký
    if (maLop && lichHoc && ngayKhaiGiangDuKien) {
        displayRegisteredSchedule(maLop, lichHoc, ngayKhaiGiangDuKien);
        document.getElementById('thongBaoLich').innerText = 'BẠN ĐÃ ĐĂNG KÝ LỊCH HỌC';
        document.getElementById('registrationMessage').style.display = 'block';
        loadingElement.style.display = 'none'; // Ẩn màn chờ
        return;
    }

    // Nếu không có mã bàn giao, xử lý logic thông thường
    if (tenSanPham === "SpeakWell") {
        chonLichSpeakWell(); // Hiển thị form chọn lịch học
    } else {
        // Nếu chưa đăng ký, lấy danh sách lớp học để so sánh
        const filteredLopHocData = (await fetchDataLopHoc(tenSanPham, size, trinhDo, loaiGiaoVien)).list;

        if (filteredLopHocData.length > 0) {
            displayResults(filteredLopHocData,quayVe); // Hiển thị danh sách lớp học phù hợp
        } else {
            if (tenSanPham === "Easy PASS") {
                chuaCoLich();
            } else {
                displaySelectionForm(false); // Hiển thị form chọn lịch học khác
            }
        }
    }

    loadingElement.style.display = 'none'; // Ẩn màn chờ
}



//Đối với học viên đã đăng ký lịch
function displayRegisteredSchedule(maLop, lichHoc, ngayKhaiGiangDuKien) {
    const tableLichHoc = document.getElementById('tableLichHoc');
    tableLichHoc.innerHTML = ''; // Xóa nội dung cũ
    const ngayKhaiGiangDuKienFormat = formatDate(ngayKhaiGiangDuKien);
    // Tạo lại bảng và tiêu đề
    const tableHTML = `
                    <h1 class="mb-4 mt-4 text-center"
                            style="color: #00509f; text-transform: uppercase; font-weight: 700; font-family: 'Montserrat', sans-serif;"
                            id="thongBaoLich">Lịch học</h1>
                        <div id="registrationMessage" class="alert alert-success"
                            style="display: block; text-align: center;">
                            Bạn đã đăng ký lớp học thành công, nếu muốn thay đổi lịch học vui lòng liên hệ zalo của
                            ICANCONNECT để được hỗ trợ.
                        </div>
                        <div class="table-scroll">
                            <div class="table-responsive">
                    <table class="table table-bordered text-center" id="tableSection">
                        <thead class="table-light">
                            <tr>
                                <th>Mã lớp</th>
                                <th>Lịch học</th>
                                <th>Ngày khai giảng dự kiến</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody" >
                            <tr>
                                <td>${maLop}</td>
                                <td>${lichHoc}</td>
                                <td>${ngayKhaiGiangDuKienFormat}</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                        </div>
                `;

    // Chèn HTML vào phần tử chứa bảng
    tableLichHoc.innerHTML = tableHTML;

    // Hiển thị thông báo đăng ký thành công
    document.getElementById('registrationMessage').style.display = 'block';

    // Thay đổi tiêu đề
    document.getElementById('thongBaoLich').textContent = 'ĐĂNG KÝ LỊCH HỌC THÀNH CÔNG';

}

//Đối với học viên chưa đăng ký lịch nhưng có lịch phù hợp
function getSchedule(records) {
    const lichHoc = [];
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

    // Lặp qua từng bản ghi trong danh sách
    records.forEach(record => {
        const day = record.Weekday; // Lấy ngày học
        const time = record.Time; // Lấy giờ học
        if (day && time) {
            lichHoc.push(`${day}: ${time}`); // Thêm vào danh sách lịch học
        }
    });

    return lichHoc.length > 0 ? lichHoc.join(', ') : 'Không có lịch'; // Trả về lịch học hoặc thông báo không có lịch
}

// Hàm định dạng ngày sử dụng Intl.DateTimeFormat
function formatDate(dateString) {
    const dateParts = dateString.split('-');
    if (dateParts.length === 3) {
        const year = dateParts[0];
        const month = String(dateParts[1]).padStart(2, '0'); // Thêm số 0 đứng trước tháng
        const day = String(dateParts[2]).padStart(2, '0'); // Thêm số 0 đứng trước ngày

        const date = new Date(year, month - 1, day); // Tháng bắt đầu từ 0
        return `${day}/${month}/${year}`; // Định dạng theo kiểu dd/MM/yyyy
    }
    return dateString; // Trả về chuỗi gốc nếu không đúng định dạng
}


function displayResults(filteredData, quayVe ){
    const tableLichHoc = document.getElementById('tableLichHoc');
    tableLichHoc.innerHTML = ` 
        <h1 class="mb-4 mt-4 text-center" style="color: #00509f; text-transform: uppercase; font-weight: 700; font-family: 'Montserrat', sans-serif;" id="thongBaoLich">Lịch học</h1>
        <div id="registrationMessage" class="alert alert-success" style="display: none; text-align: center;">
            Bạn đã đăng ký lớp học thành công, nếu muốn thay đổi lịch học vui lòng liên hệ zalo của ICANCONNECT để được hỗ trợ.
        </div>
        <div class="table-scroll">
        <div class="table-responsive">
            <table class="table table-bordered text-center" id="tableSection">
                <thead class="table-light">
                    <tr>
                        <th>Mã lớp</th>
                        <th>Lịch học</th>
                        <th>Ngày khai giảng dự kiến</th>
                        <th>Hành động</th> 
                    </tr>
                </thead>
                <tbody id="tableBody"></tbody>
            </table>
        </div>
        </div>
        <div class="d-flex justify-content-center align-items-center mt-4">
        <button class="btn btn-success me-2" id="goBack" onclick="fetchData()" style="display: ${quayVe == true ? 'block' : 'none'};">Quay về</button>
            <button class="btn btn-primary" id="hienThidangKyLichNgoai"  style="display: block;" onclick="displaySelectionForm(true);">Đăng ký lịch khác</button>
        </div>
    `;
 // Hiển thị nút "Quay về" nếu showGoBack là true
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Xóa nội dung cũ
    const dangKyLichNgoaiButton = document.getElementById('hienThidangKyLichNgoai'); // Nút đăng ký lịch khác
    const tenSanPham = document.getElementById('tenSanPham').value;
    if (tenSanPham == "Easy PASS") {
        dangKyLichNgoaiButton.style.display = 'none';
    }
    // Nhóm các bản ghi theo Classcode
    const groupedRecords = {};
    filteredData.forEach(record => {
        const classCode = record.Classcode; // Lấy mã lớp
        if (!groupedRecords[classCode]) {
            groupedRecords[classCode] = []; // Khởi tạo mảng nếu chưa có
        }
        groupedRecords[classCode].push(record); // Thêm bản ghi vào nhóm
    });

    // Tạo bảng từ các bản ghi đã nhóm
    for (const classCode in groupedRecords) {
        const records = groupedRecords[classCode];

        // Gọi getSchedule để lấy lịch học từ các bản ghi có cùng classCode
        const lichHoc = getSchedule(records); // Lấy lịch học
        const startDate = records[0].Start_date; // Ngày khai giảng từ bản ghi đầu tiên
        const startDateFormatted = formatDate(startDate);
        // Tạo một hàng mới cho bảng
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${classCode}</td>
            <td>${lichHoc}</td>
            <td>${startDateFormatted}</td>
            <td><button id="register-${classCode}" class="btn btn-success btn-sm">Đăng ký</button></td>
        `;
        tableBody.appendChild(newRow); // Thêm hàng mới vào bảng

        // Gán sự kiện cho nút "Đăng ký"
        document.getElementById(`register-${classCode}`).addEventListener('click', function () {
            handleRegisterClick(classCode, lichHoc, startDate);
        });
    }

}


async function handleRegisterClick(classCode, lichHoc, startDate) {
    const result = await Swal.fire({
        title: 'Bạn có chắc chắn đăng ký lịch học này không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {

        try {
            // Tìm lớp học hiện tại theo mã lớp
            const lopHocData = (await timLopHoc(classCode)).list;

            if (lopHocData && lopHocData.length > 0) {
                // Duyệt qua tất cả các bản ghi có cùng mã lớp và cập nhật trường soDaDangKy
                for (const record of lopHocData) {
                    const soDaDangKyHienTai = record.soDaDangKy || 0;
                    const soSlotConLai = record.soSlotConLai || 0;
                    // Kiểm tra xem còn slot hay không
                    if (soSlotConLai <= 0) {
                        Swal.fire('Lớp học đã đủ sĩ số, vui lòng chọn lớp khác.', '', 'warning');
                        fetchAndCompareData(false)
                        return;
                    }
                    const updatedLopHocData = {
                        Id: record.Id,  // Sử dụng Id của từng bản ghi để cập nhật đúng dữ liệu
                        soDaDangKy: soDaDangKyHienTai + 1,
                    };

                    // Gọi hàm cập nhật lớp học cho từng bản ghi
                    await updateLopHoc(updatedLopHocData);
                }
                const updatedData = {
                    Id: document.getElementById('Id').value.trim(),
                    maLop: classCode,
                    lichHoc: lichHoc,
                    ngayKhaiGiangDuKien: startDate,
                    trangThai: 'Đã chọn lịch thành công',
                    status: 'L3.Nghe máy và xác nhận lịch'
                };
                // Cập nhật thông tin học viên
                await updateStudentData(updatedData);
                Swal.fire('Đăng ký thành công!', '', 'success');
                displayRegisteredSchedule(classCode, lichHoc, startDate);
            } else {
                Swal.fire('Không tìm thấy lớp học!', '', 'error');
            }
        } catch (error) {
            console.error('Error during update:', error);
            Swal.fire('Đăng ký không thành công!', error.message, 'error');
        }
    }
}


//Đối với học viên chưa đăng ký lịch và không có lịch phù hợp 

// Hàm hiển thị form chọn lịch học mới
const displaySelectionForm = (showGoBack = false) => {
    const tableLichHoc = document.getElementById('tableLichHoc');
    tableLichHoc.innerHTML = ''; // Xóa nội dung cũ

    const formHTML = `
        <div id="selectionForm" class="alert alert-warning text-center">
            <h4 class="col-12 mb-4 mt-4" style="color: #00509f; text-transform: uppercase;" id="thongBaoLich">
                Chưa có lịch học phù hợp
            </h4>
            <h4 class="col-12 mb-4 mt-2" style="color: #00509f; text-transform: uppercase;">
                Bạn hãy chọn lịch có thể học dưới đây:
            </h4>
            <div class="row mb-3">
                <label for="daySelect" class="col-12 col-form-label text-start">Chọn ngày có thể học:</label>
                <div class="col-12">
                    <select id="daySelect" class="form-select">
                        <option value="">Chọn ngày trong tuần có thể học</option>
                    </select>
                </div>
            </div>
            <div class="row mb-3">
                <label for="timeSelect" class="col-12 col-form-label text-start">Chọn giờ học:</label>
                <div class="col-12">
                    <select id="timeSelect" class="form-select">
                        <option value="">Chọn giờ</option>
                    </select>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-3">
                <button class="btn btn-success me-2" id="goBack" onclick="fetchAndCompareData(false)" style="display: none;">Quay về</button>
                <button class="btn btn-secondary" type="button" id="dangKyLichNgoai" onclick="dangKyLichNgoai()">Đăng ký lịch</button>
            </div>
        </div>
    `;
    tableLichHoc.innerHTML = formHTML;

    // Hiển thị nút "Quay về" nếu showGoBack là true
    const goBackButton = document.getElementById('goBack');
    goBackButton.style.display = showGoBack ? 'block' : 'none';

    // Sau khi form đã được thêm vào DOM, gọi hàm fetch để lấy dữ liệu
    fetchDataLichHocNgoai();
};


// Khai báo biến để lưu dữ liệu lịch học
const baseUrlLichHocNgoai = 'https://noco-erp.com/api/v2/tables/matsszn85hw6pha/records'; // URL API để lấy dữ liệu lịch học ngoài

let lichHocData = []; // Biến để lưu dữ liệu lịch học

const fetchDataLichHocNgoai = async () => {
    try {
        const response = await fetch(baseUrlLichHocNgoai, {
            method: 'GET',
            headers: {
                'xc-token': apiToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || !data.list || data.list.length === 0) {
            return;
        }

        lichHocData = data.list; // Lưu dữ liệu vào biến toàn cục
        populateDaySelect(); // Gọi hàm để điền dữ liệu vào select
    } catch (error) {
    }
};

const populateDaySelect = () => {
    const daySelect = document.getElementById('daySelect');
    daySelect.innerHTML = ''; // Xóa nội dung cũ

    // Thêm giá trị mặc định "Chọn ngày trong tuần có thể học"
    const defaultOption = document.createElement('option');
    defaultOption.value = ''; // Giá trị trống để không chọn ngày nào
    defaultOption.textContent = 'Chọn ngày trong tuần có thể học';
    defaultOption.disabled = true; // Không cho phép chọn
    defaultOption.selected = true; // Đặt làm lựa chọn mặc định
    daySelect.appendChild(defaultOption);

    // Thêm các option từ dữ liệu lichHocData
    lichHocData.forEach(item => {
        if (item.thu) {
            const option = document.createElement('option');
            option.value = item.thu;
            option.textContent = item.thu;
            daySelect.appendChild(option);
        }
    });

    // Thêm sự kiện onchange để cập nhật giờ học
    daySelect.onchange = () => populateTimeSelect(daySelect.value);
};


const populateTimeSelect = (selectedDay) => {
    const timeSelect = document.getElementById('timeSelect');
    timeSelect.innerHTML = ''; // Xóa nội dung cũ

    // Duyệt qua dữ liệu lịch học và tìm giờ tương ứng
    lichHocData.forEach(item => {
        if (item.thu === selectedDay) {
            // Thêm giờ 1
            if (item.gio_1) {
                const option1 = document.createElement('option');
                option1.value = item.gio_1;
                option1.textContent = item.gio_1;
                timeSelect.appendChild(option1);
            }

            // Thêm giờ 2
            if (item.gio_2) {
                const option2 = document.createElement('option');
                option2.value = item.gio_2;
                option2.textContent = item.gio_2;
                timeSelect.appendChild(option2);
            }
        }
    });
};

// Thêm sự kiện cho nút đăng ký lịch học
function dangKyLichNgoai() {
    const daySelect = document.getElementById('daySelect');
    const timeSelect = document.getElementById('timeSelect');

    // Lấy giá trị của ngày và giờ đang chọn
    const selectedDay = daySelect.value;
    const selectedTime = timeSelect.value;

    // Kiểm tra nếu cả ngày và giờ đều được chọn
    if (selectedDay && selectedTime) {
        const lichHocValue = `${selectedDay} : ${selectedTime}`; // Tạo chuỗi Ngày : Giờ
        var data = {
            Id: document.getElementById('Id').value.trim(),
            lichHoc: lichHocValue,
            trangThai: 'Đăng ký lịch ngoài' // Trạng thái được cập nhật
        };

        // Hiển thị SweetAlert để xác nhận trước khi thực hiện cập nhật
        Swal.fire({
            title: 'Xác nhận đăng ký',
            text: `Bạn có chắc chắn muốn đăng ký lịch học: ${lichHocValue}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                // Nếu người dùng xác nhận, thực hiện cập nhật dữ liệu
                updateStudentData(data).then(() => {
                    Swal.fire('Đăng ký thành công!', '', 'success');
                    hienThiLichNgoai(data.lichHoc);
                });
            }
        });
    } else {
        // Sử dụng SweetAlert để hiển thị thông báo nếu thông tin chưa đầy đủ
        Swal.fire({
            icon: 'warning',
            title: 'Thiếu thông tin',
            text: 'Vui lòng chọn cả ngày và giờ học!',
            confirmButtonText: 'OK'
        });
    }
}


function hienThiLichNgoai(lichHoc) {
    // Trực tiếp chèn form chọn lịch học mới vào DOM
    const tableLichHoc = document.getElementById('tableLichHoc');
    tableLichHoc.innerHTML = ''; // Xóa nội dung cũ

    const formHTML = `
  <div id="selectionForm" class="alert alert-warning text-center">
    <h1 class="col-12 mb-4 mt-4" style="color: #00509f; text-align: center; text-transform: uppercase; font-weight: 700; font-family: 'Montserrat', sans-serif;" id="thongBaoLich">
        Đã đăng ký lịch học
    </h1>
    <div class="row mb-3 align-items-center d-flex justify-content-center"> 
        <div class="col-auto text-center"> <!-- Căn giữa cho tiêu đề -->
            <h4 class="col-form-label">Bạn đã đăng ký lịch học vào:</h4>
        </div>
        <div class="col-auto text-center"> <!-- Căn giữa cho giá trị lichHoc -->
            <span class="text-danger" style="font-size: 16px; font-weight: 600;">
                ${lichHoc}
            </span>
        </div>
    </div>
    <div class="text-center"> <!-- Căn giữa cho thông báo -->
        <h4 class="col-12 col-form-label">
            ICANCONNECT sẽ liên hệ để xác nhận lớp học cho bạn trong thời gian sớm nhất!
        </h4>
    </div>
</div>
    `;
    tableLichHoc.innerHTML = formHTML; // Chèn form vào DOM
}

function chuaCoLich() {
    // Trực tiếp chèn form chọn lịch học mới vào DOM
    const tableLichHoc = document.getElementById('tableLichHoc');
    tableLichHoc.innerHTML = ''; // Xóa nội dung cũ

    const formHTML = `
  <div id="selectionForm" class="alert alert-warning text-center">
    <h1 class="col-12 mb-4 mt-4" style="color: #00509f; text-align: center; text-transform: uppercase; font-weight: 700; font-family: 'Montserrat', sans-serif;" id="thongBaoLich">
        Chưa có lịch học phù hợp
    </h1>
    <div class="row mb-3 align-items-center d-flex justify-content-center"> 
        <div class="col-auto text-center"> <!-- Căn giữa cho tiêu đề -->
            <h4 class="col-form-label">Hiện tại chưa có lịch học phù hợp với bạn</h4>
        </div>
    </div>
    <div class="text-center"> <!-- Căn giữa cho thông báo -->
        <h4 class="col-12 col-form-label">
            ICANCONNECT sẽ liên hệ để xếp lớp học cho bạn trong thời gian sớm nhất!
        </h4>
    </div>
</div>
    `;
    tableLichHoc.innerHTML = formHTML; // Chèn form vào DOM
}

//Speak Well
async function dataCa() {
    const baseUrlCa = `https://noco-erp.com/api/v2/tables/m9ruq2cgj9605ix/records?viewId=vwrepzw97mh4v1lv`;
    try {
        const response = await fetch(baseUrlCa, {
            method: 'GET',
            headers: {
                'xc-token': apiToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Lỗi: ${response.status}`);
        }

        const data = await response.json();

        // Lấy phần tử ComboBox
        const timeRangeComboBox = document.getElementById('timeRangeComboBox');
        if (!timeRangeComboBox) {
            console.error("Không tìm thấy phần tử 'timeRangeComboBox'");
            return;
        }

        // Xóa các tùy chọn cũ
        timeRangeComboBox.innerHTML = '';

        // Tạo option đầu tiên "Chọn thời gian học"
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'Chọn thời gian học';
        timeRangeComboBox.appendChild(defaultOption);

        // Kiểm tra nếu dữ liệu là một mảng hoặc có thuộc tính `list`
        const records = Array.isArray(data) ? data : data.list || [];

        if (records.length === 0) {
            console.warn("Không có dữ liệu để hiển thị trong ComboBox");
            return;
        }

        // Tạo các tùy chọn từ `thoiGianBatDau` và `thoiGianKetThuc`
        records.forEach(record => {
            const startTime = record.thoiGianBatDau;
            const endTime = record.thoiGianKetThuc;
            if (startTime && endTime) {
                const option = document.createElement('option');
                option.value = `${startTime},${endTime}`; // Giá trị chứa cả bắt đầu và kết thúc
                option.text = `${startTime} - ${endTime}`;
                timeRangeComboBox.appendChild(option);
            }
        });

        // Lắng nghe sự kiện thay đổi khi người dùng chọn một giá trị
        timeRangeComboBox.addEventListener('change', function () {
            const selectedOption = timeRangeComboBox.value;
            const [startTime, endTime] = selectedOption.split(',');

            // Nếu không chọn gì, gán giá trị rỗng cho startTime và endTime
            if (!selectedOption) {
                document.getElementById('startTime').value = '';
                document.getElementById('endTime').value = '';
            } else {
                // Cập nhật giá trị vào các ô input startTime và endTime
                document.getElementById('startTime').value = startTime;
                document.getElementById('endTime').value = endTime;
            }
        });

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu ca:", error);
    }
}

function chonLichSpeakWell() {
    dataCa();
    // Trực tiếp chèn form chọn lịch học mới vào DOM
    const tableLichHoc = document.getElementById('tableLichHoc');
    tableLichHoc.innerHTML = ''; // Xóa nội dung cũ

    const formHTML = ` 
        <!-- Box chứa tất cả các phần: Ngày và Giờ cùng với bảng -->
        <div class="box-container bg-white p-4 rounded shadow-sm">
            <!-- Dòng 1: Ngày trong tuần có thể học và checkbox -->
            <div class="d-flex flex-column flex-sm-row align-items-center mb-3">
                <h5 class="mb-2 mb-sm-0">Ngày trong tuần có thể học:</h5>
                <div class="d-flex flex-wrap justify-content-center ms-3">
                    <label class="me-3"><input type="checkbox" id="thu2"> Thứ 2</label>
                    <label class="me-3"><input type="checkbox" id="thu3"> Thứ 3</label>
                    <label class="me-3"><input type="checkbox" id="thu4"> Thứ 4</label>
                    <label class="me-3"><input type="checkbox" id="thu5"> Thứ 5</label>
                    <label class="me-3"><input type="checkbox" id="thu6"> Thứ 6</label>
                    <label class="me-3"><input type="checkbox" id="thu7"> Thứ 7</label>
                    <label><input type="checkbox" id="cn"> Chủ Nhật</label>
                </div>
            </div>

            <!-- Dòng 2: Giờ có thể học -->
            <div class="d-flex flex-column flex-sm-row align-items-center mb-3">
                <h5 class="mb-2 mb-sm-0">Giờ có thể học:</h5>
                <div class="ms-4">
                    <select id="timeRangeComboBox" class="form-select">
                        <option value="">Chọn thời gian</option>
                    </select>
                      <!-- Các ô input để hiển thị startTime và endTime -->
                        <input type="text" id="startTime" name="startTime" hidden />
                        <input type="text" id="endTime" name="endTime" hidden />
                </div>
            </div>
    <!-- Dòng 3: Nút Tìm kiếm -->
        <div class="d-flex justify-content-end mb-3">
            <button class="btn btn-primary" onclick="loadSchedule()">Tìm kiếm</button>
        </div>
            <!-- Bảng hiển thị lịch học -->
            <div class="table-scroll">
                <div class="table-responsive">
                    <table class="table table-bordered text-center" id="tableSection">
                        <thead class="table-light">
                            <tr>
                                <th>Tên giáo viên</th>
                                <th>Giới tính</th>
                                <th>Thời gian</th>
                                <th>Thứ 2</th>
                                <th>Thứ 3</th>
                                <th>Thứ 4</th>
                                <th>Thứ 5</th>
                                <th>Thứ 6</th>
                                <th>Thứ 7</th>
                                <th>Chủ Nhật</th>
                                <th>Hành động</th> <!-- Cột hành động -->
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                            <!-- Các dòng dữ liệu sẽ được thêm vào ở đây -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;

    tableLichHoc.innerHTML = formHTML; // Chèn form vào DOM
}

function loadSchedule() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    // Lấy các ngày đã chọn từ các checkbox
    const selectedDays = [];
    if (document.getElementById('thu2').checked) selectedDays.push("Monday");
    if (document.getElementById('thu3').checked) selectedDays.push("Tuesday");
    if (document.getElementById('thu4').checked) selectedDays.push("Wednesday");
    if (document.getElementById('thu5').checked) selectedDays.push("Thursday");
    if (document.getElementById('thu6').checked) selectedDays.push("Friday");
    if (document.getElementById('thu7').checked) selectedDays.push("Saturday");
    if (document.getElementById('cn').checked) selectedDays.push("Sunday");

    const loaiGiaoVien = document.getElementById('loaiGiaoVien').value;
    // Kiểm tra xem người dùng có chọn ngày và giờ không
    if (selectedDays.length === 0 || !startTime || !endTime) {
        // Hiển thị cảnh báo SweetAlert nếu chưa chọn ít nhất 1 ngày hoặc giờ
        Swal.fire({
            icon: 'warning',
            title: 'Lỗi!',
            text: 'Vui lòng chọn ít nhất một ngày và thời gian!',
            confirmButtonText: 'OK'
        });
        return; // Dừng lại nếu không đủ điều kiện
    }
    // Xây dựng điều kiện tìm kiếm động cho ngày
    let dayConditions = selectedDays.map(day => `(${day},eq,Blank)`).join("~or");

    if (dayConditions) {
        dayConditions = "~and" + "(" + dayConditions + ")";
    }

    const apiUrl = `https://noco-erp.com/api/v2/tables/m9jv8e3mdpvg9vz/records?where=(thoiGian,btw,${startTime},${endTime})~and(loaiGiaoVien,anyof,${loaiGiaoVien})${dayConditions}`;

    // Gửi yêu cầu đến API
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'xc-token': apiToken,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = ''; // Xóa dữ liệu cũ trong bảng

            if (Array.isArray(data.list)) {
                const groupedData = {};

                // Nhóm các dữ liệu theo tên giáo viên
                data.list.forEach(record => {
                    const teacherName = record.tenGV;
                    if (!groupedData[teacherName]) {
                        groupedData[teacherName] = [];
                    }
                    groupedData[teacherName].push(record);
                });
                let foundSchedule = false;
                // Duyệt qua các nhóm giáo viên và tạo các dòng cho bảng
                for (const teacherName in groupedData) {
                    const rows = groupedData[teacherName];
                    let isAvailable = false;
                    const row = document.createElement('tr');

                    // Kiểm tra xem giáo viên có ít nhất 1 ngày rảnh trong các ngày đã chọn hay không
                    rows.forEach(record => {
                        selectedDays.forEach(day => {
                            if (record[day] === "Blank") {
                                isAvailable = true;  // Nếu có ít nhất 1 ngày rảnh, đánh dấu giáo viên này là rảnh
                            }
                        });
                    });

                    // Nếu giáo viên có ít nhất 1 ngày rảnh và loại giáo viên khớp
                    if (isAvailable && rows[0].loaiGiaoVien === loaiGiaoVien) {
                        foundSchedule = true;
                        const rowData = `
                        <td rowspan="${rows.length}">${teacherName}</td>
                        <td rowspan="${rows.length}">${rows[0].gioiTinh}</td>
                        <td rowspan="${rows.length}">${rows[0].thoiGian}</td>
                        <td>${rows[0].Monday === "Blank" ? 'Rảnh' : ''}</td>
                        <td>${rows[0].Tuesday === "Blank" ? 'Rảnh' : ''}</td>
                        <td>${rows[0].Wednesday === "Blank" ? 'Rảnh' : ''}</td>
                        <td>${rows[0].Thursday === "Blank" ? 'Rảnh' : ''}</td>
                        <td>${rows[0].Friday === "Blank" ? 'Rảnh' : ''}</td>
                        <td>${rows[0].Saturday === "Blank" ? 'Rảnh' : ''}</td>
                        <td>${rows[0].Sunday === "Blank" ? 'Rảnh' : ''}</td>
                        <td rowspan="${rows.length}">
                            <button class="btn btn-success" onclick="openScheduleModal('${teacherName}', '${rows[0].thoiGian}', '${encodeURIComponent(JSON.stringify(rows[0]))}', '${rows[0].Id}')">Chọn giáo viên</button>
                        </td>

                    `;
                        const rowElement = document.createElement('tr');
                        rowElement.innerHTML = rowData;
                        tableBody.appendChild(rowElement);

                        // Thêm các dòng giáo viên có tên trùng vào bảng
                        for (let i = 1; i < rows.length; i++) {
                            const subRow = document.createElement('tr');
                            subRow.innerHTML = `
                            <td>${rows[i].Monday === "Blank" ? 'Rảnh' : ''}</td>
                            <td>${rows[i].Tuesday === "Blank" ? 'Rảnh' : ''}</td>
                            <td>${rows[i].Wednesday === "Blank" ? 'Rảnh' : ''}</td>
                            <td>${rows[i].Thursday === "Blank" ? 'Rảnh' : ''}</td>
                            <td>${rows[i].Friday === "Blank" ? 'Rảnh' : ''}</td>
                            <td>${rows[i].Saturday === "Blank" ? 'Rảnh' : ''}</td>
                            <td>${rows[i].Sunday === "Blank" ? 'Rảnh' : ''}</td>
                        `;
                            tableBody.appendChild(subRow);
                        }
                    }
                }
                if (!foundSchedule) {
                    // Nếu không có dữ liệu, hiển thị thông báo
                    const noDataRow = document.createElement('tr');
                    noDataRow.innerHTML = `<td colspan="10" style="text-align: center; color: red;">Không có lịch học phù hợp</td>`;
                    tableBody.appendChild(noDataRow);
                }
            } else {
                console.log('Dữ liệu không hợp lệ hoặc list không phải là một mảng');
            }
        })
        .catch(error => {
            console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
        });
}

function openScheduleModal(teacherName, thoiGian, scheduleData, Id) {
    const modalBody = document.getElementById('scheduleTableBody');
    modalBody.innerHTML = ''; // Xóa nội dung cũ

    // Giải mã và phân tích dữ liệu JSON từ chuỗi đã mã hóa
    const decodedScheduleData = JSON.parse(decodeURIComponent(scheduleData));

    // Hàm này giúp tạo một dòng với thông tin giáo viên
    function createRow(day) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center;">${teacherName}</td>
            <td>${thoiGian}</td>
            <td>${day}</td>
            <td><input type="checkbox" name="scheduleSelect" value="${day}" data-id="${Id}"></td>
        `;

        modalBody.appendChild(row);
    }

    // Kiểm tra và tạo các dòng cho những ngày còn trống
    if (decodedScheduleData.Monday === "Blank") {
        createRow("Thứ 2", "Monday");
    }
    if (decodedScheduleData.Tuesday === "Blank") {
        createRow("Thứ 3", "Tuesday");
    }
    if (decodedScheduleData.Wednesday === "Blank") {
        createRow("Thứ 4", "Wednesday");
    }
    if (decodedScheduleData.Thursday === "Blank") {
        createRow("Thứ 5", "Thursday");
    }
    if (decodedScheduleData.Friday === "Blank") {
        createRow("Thứ 6", "Friday");
    }
    if (decodedScheduleData.Saturday === "Blank") {
        createRow("Thứ 7", "Saturday");
    }
    if (decodedScheduleData.Sunday === "Blank") {
        createRow("Chủ nhật", "Sunday");
    }

    // Hiển thị modal
    $('#scheduleModal').modal('show');
}


document.getElementById('confirmScheduleBtn').addEventListener('click', async () => {
    const teacherName = document.querySelector('#scheduleTableBody td').innerText; // Lấy tên giáo viên
    const maLopSW = document.getElementById('maLopSW').value;
    console.log(maLopSW);

    // Thu thập các checkbox đã được chọn
    const selectedDays = [];
    const times = []; // Mảng để lưu thời gian tương ứng với mỗi ngày
    const checkboxes = document.querySelectorAll('#scheduleTableBody input[type="checkbox"]:checked');
    const dayMapping = {
        "Thứ 2": "Monday",
        "Thứ 3": "Tuesday",
        "Thứ 4": "Wednesday",
        "Thứ 5": "Thursday",
        "Thứ 6": "Friday",
        "Thứ 7": "Saturday",
        "Chủ nhật": "Sunday"
    };

    // Tạo đối tượng chứa dữ liệu cập nhật lịch rảnh cho giáo viên
    const freeTimeUpdateData = {};

    // Duyệt qua từng checkbox đã chọn
    checkboxes.forEach((checkbox) => {
        const row = checkbox.closest('tr');
        const day = row.querySelector('td:nth-child(3)').innerText; // Lấy tên ngày
        const teacherId = checkbox.getAttribute('data-id'); // Lấy data-id của giáo viên
        const scheduleField = dayMapping[day]; // Tìm trường tương ứng với ngày
        const time = row.querySelector('td:nth-child(2)').innerText; // Lấy thời gian

        // Thêm ngày vào mảng selectedDays
        selectedDays.push(day);

        // Nếu thời gian chưa có trong mảng, thêm vào mảng times
        if (!times.includes(time)) {
            times.push(time);
        }

        // Cập nhật dữ liệu cho giáo viên dựa trên teacherId
        if (!freeTimeUpdateData[teacherId]) {
            freeTimeUpdateData[teacherId] = {
                Id: teacherId // Lưu ID của giáo viên
            };
        }

        // Cập nhật lịch rảnh cho giáo viên dựa trên ngày và trạng thái
        if (scheduleField) {
            freeTimeUpdateData[teacherId][scheduleField] = maLopSW;
        }
    });

    // Kiểm tra nếu không có checkbox nào được chọn
    if (selectedDays.length === 0) {
        // Sử dụng SweetAlert để thông báo
        Swal.fire({
            icon: 'warning',
            title: 'Chưa chọn ngày',
            text: 'Vui lòng chọn ít nhất một ngày.',
        });
        return;
    }

    // Gọi hàm tính ngày khai giảng dự kiến
    const ngayKhaiGiang = getNgayKhaiGiang(selectedDays);

    // Gộp các ngày đã chọn thành một chuỗi
    const daysString = selectedDays.join(', ');

    // Gộp các thời gian thành một chuỗi
    const timeString = times.join(', ');

    // Tạo chuỗi lichHoc từ các ngày đã chọn và thời gian
    const lichHoc = `${daysString}: ${timeString}`;

    // Tạo dữ liệu cập nhật cho học sinh
    const updatedData = {
        Id: document.getElementById('Id').value.trim(),
        maLop: maLopSW,
        lichHoc: lichHoc,
        ngayKhaiGiangDuKien: ngayKhaiGiang,
        trangThai: 'Đã chọn lịch thành công',
        status: 'L3.Nghe máy và xác nhận lịch'
    };

    try {
        // Sử dụng SweetAlert để xác nhận trước khi cập nhật
        const confirmation = await Swal.fire({
            icon: 'question',
            title: 'Xác nhận',
            text: `Bạn có chắc chắn xác nhận lịch đã chọn không?`,
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        if (confirmation.isConfirmed) {
            // Cập nhật dữ liệu cho học sinh
            const result = await updateStudentData(updatedData);

            // Cập nhật lịch rảnh cho giáo viên
            for (const teacherId in freeTimeUpdateData) {
                await updateClassSP(freeTimeUpdateData[teacherId]);
            }

            // Hiển thị thông báo thành công
            Swal.fire({
                icon: 'success',
                title: 'Đăng ký lịch học thành công!',
                text: 'Lịch học và lịch rảnh đã được cập nhật thành công!',
            });

            // Gọi hàm xử lý sau khi đăng ký thành công
            dangKyThanhCongSP(updatedData.lichHoc, updatedData.maLop, updatedData.ngayKhaiGiangDuKien);
        }
    } catch (error) {
        // Hiển thị thông báo lỗi
        Swal.fire({
            icon: 'error',
            title: 'Cập nhật thất bại!',
            text: `Lỗi: ${error.message}`,
        });
    }

    // Đóng modal
    $('#scheduleModal').modal('hide');
});

function getNgayKhaiGiang(selectedDays) {
    const today = new Date(); // Ngày hiện tại
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayMapping = {
        "Thứ 2": "Monday",
        "Thứ 3": "Tuesday",
        "Thứ 4": "Wednesday",
        "Thứ 5": "Thursday",
        "Thứ 6": "Friday",
        "Thứ 7": "Saturday",
        "Chủ nhật": "Sunday"
    };

    let khaiGiangDate = null; // Ngày khai giảng dự kiến

    // Duyệt qua các ngày đã chọn
    selectedDays.forEach(day => {
        const dayOfWeek = dayMapping[day];
        const dayIndex = daysOfWeek.indexOf(dayOfWeek);
        const daysUntilDay = (dayIndex - today.getDay() + 7) % 7; // Tính số ngày từ hôm nay đến ngày đã chọn
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysUntilDay);

        // Kiểm tra nếu ngày khai giảng hợp lệ
        const differenceInDays = (targetDate - today) / (1000 * 60 * 60 * 24);

        // Nếu ngày khai giảng không hợp lệ (ngày hiện tại - ngày khai giảng < 3)
        if (differenceInDays <= 3) {
            // Nếu ngày khai giảng không hợp lệ, cần tịnh tiến lên
            targetDate.setDate(targetDate.getDate() + 7); // Tịnh tiến lên 1 tuần
        }

        // Chọn ngày khai giảng hợp lệ gần nhất
        if (!khaiGiangDate || targetDate < khaiGiangDate) {
            khaiGiangDate = targetDate;
        }
    });

    // Trả về ngày khai giảng dự kiến (nếu có)
    return khaiGiangDate ? khaiGiangDate.toLocaleDateString() : null;
}


function dangKyThanhCongSP(lichHoc, teacherName, ngayKhaiGiangDuKien) {
    // Trực tiếp chèn form chọn lịch học mới vào DOM
    const tableLichHoc = document.getElementById('tableLichHoc');
    tableLichHoc.innerHTML = ''; // Xóa nội dung cũ

    const formHTML = `
    <div id="selectionForm" class="alert alert-warning text-center">
        <h1 class="col-12 mb-4 mt-4" style="color: #00509f; text-align: center; text-transform: uppercase; font-weight: 700; font-family: 'Montserrat', sans-serif;" id="thongBaoLich">
            Đã đăng ký lịch học
        </h1>
        <div class="row mb-3 align-items-center d-flex justify-content-center"> 
            <div class="col-auto text-center"> <!-- Căn giữa cho tiêu đề -->
                <h4 class="col-form-label">Bạn đã đăng ký lịch học với mã lớp:</h4>
            </div>
            <div class="col-auto text-center"> 
                <span class="text-danger" style="font-size: 16px; font-weight: 600;">
                    ${teacherName}
                </span>
            </div>
        </div>
        <div class="row mb-3 align-items-center d-flex justify-content-center"> 
            <div class="col-auto text-center"> <!-- Căn giữa cho tiêu đề -->
                <h4 class="col-form-label">Lịch học:</h4>
            </div>
            <div class="col-auto text-center"> <!-- Căn giữa cho giá trị lichHoc -->
                <span class="text-danger" style="font-size: 16px; font-weight: 600;">
                    ${lichHoc}
                </span>
            </div>
        </div>
         <div class="row mb-3 align-items-center d-flex justify-content-center"> 
            <div class="col-auto text-center"> <!-- Căn giữa cho tiêu đề -->
                <h4 class="col-form-label">Ngày khai giảng dự kiến:</h4>
            </div>
            <div class="col-auto text-center"> <!-- Căn giữa cho giá trị lichHoc -->
                <span class="text-danger" style="font-size: 16px; font-weight: 600;">
                    ${ngayKhaiGiangDuKien}
                </span>
            </div>
        </div>
        <div class="text-center"> <!-- Căn giữa cho thông báo -->
            <h4 class="col-12 col-form-label">
                ICANCONNECT sẽ liên hệ để xác nhận lớp học cho bạn trong thời gian sớm nhất!
            </h4>
        </div>
    </div>
    `;
    tableLichHoc.innerHTML = formHTML; // Chèn form vào DOM
}



//Đối với học viên được bàn giao mã lớp


// Hàm để gọi API và lấy dữ liệu `maLopBanGiao`
async function fetchMaLopBanGiao(maLopBanGiao) {
    const apiUrl = `https://noco-erp.com/api/v2/tables/mqccf6avwxoqc5n/records?where=(ma_order,allof,${maLopBanGiao})`;

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'xc-token': apiToken
        }
    });

    if (!response.ok) {
        console.error(`Error fetching maLopBanGiao: ${response.status}`);
        return;
    }

    const data = await response.json();
    const records = data.list || [];

    // Nếu tìm thấy dữ liệu bàn giao, lấy mã lớp và tìm chi tiết lớp học
    if (records.length > 0) {
        const maLop = records[0].ma_lop; // Lấy mã lớp đầu tiên

        if (maLop) {
            const lopHocDetails = await timLopHoc(maLop); // Gọi hàm timLopHoc
            if (lopHocDetails && lopHocDetails.list && lopHocDetails.list.length > 0) {
                // Chuyển đổi lịch học
                const lichHoc = lopHocDetails.list
                    .map(item => `${item.Weekday}: ${item.Time}`)
                    .join(', ');

                const ngayKhaiGiang = lopHocDetails.list[0]?.Start_date || 'Chưa có ngày khai giảng';

                // Gọi hàm displayForm để hiển thị thông tin lớp học
                displayForm(maLop, lichHoc, ngayKhaiGiang);
            } else {
                console.warn('Không tìm thấy thông tin chi tiết lớp học.');
            }
        } else {
            console.warn('Không tìm thấy mã lớp.');
        }
    } else {
        console.warn('Không tìm thấy dữ liệu mã bàn giao.');
    }
}

// Hàm hiển thị form thông tin lớp học
function displayForm(maLop, lichHoc, ngayKhaiGiang) {
    const tableLichHoc = document.getElementById('tableLichHoc');
    const startDateFormatted = formatDate(ngayKhaiGiang);
    tableLichHoc.innerHTML = `
        <div class="alert alert-info text-center">
            <h4>Bạn đã được giữ chỗ vào lớp học:</h4>
            <p><strong>Mã lớp:</strong> ${maLop}</p>
            <p><strong>Lịch học:</strong> ${lichHoc}</p>
            <p><strong>Ngày khai giảng:</strong> ${startDateFormatted}</p>
            <p>Bạn có đồng ý tham gia lớp học này không?</p>
            <div class="d-flex justify-content-center mt-3">
                <button class="btn btn-success me-3" onclick="confirmJoin('${maLop}')">Có, tôi đồng ý</button>
                <button class="btn btn-danger" onclick="fetchAndCompareData(true)">Không, chọn lịch khác</button>
            </div>
        </div>
    `;
}
async function confirmJoin(maLop) {
    const result = await Swal.fire({
        title: 'Bạn có chắc chắn muốn tham gia lớp học này không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
        const loadingElement = document.getElementById('loading');
        loadingElement.style.display = 'flex'; // Hiển thị màn chờ

        try {
            // Tìm lớp học hiện tại theo mã lớp
            const lopHocData = (await timLopHoc(maLop)).list;

            if (lopHocData && lopHocData.length > 0) {
                // Duyệt qua tất cả các bản ghi có cùng mã lớp và cập nhật trường soDaDangKy
                for (const record of lopHocData) {
                    const soDaDangKyHienTai = record.soDaDangKy || 0;
                    const updatedLopHocData = {
                        Id: record.Id,  // ID của bản ghi lớp học
                        soDaDangKy: soDaDangKyHienTai + 1,
                    };

                    // Gọi hàm cập nhật lớp học
                    await updateLopHoc(updatedLopHocData);
                }

                // Tạo dữ liệu cập nhật học viên
                const updatedData = {
                    Id: document.getElementById('Id').value.trim(), // ID của học viên
                    maLop: maLop,
                    lichHoc: lopHocData[0]?.Weekday + ": " + lopHocData[0]?.Time, // Lịch học
                    ngayKhaiGiangDuKien: lopHocData[0]?.Start_date, // Ngày khai giảng
                    trangThai: 'Đã xác nhận lịch được giữ',
                    status: 'L3.Nghe máy và xác nhận lịch'
                };

                // Gọi hàm cập nhật thông tin học viên
                await updateStudentData(updatedData);

                Swal.fire('Đăng ký lớp học thành công!', '', 'success');
                displayRegisteredSchedule(updatedData.maLop, updatedData.lichHoc, updatedData.ngayKhaiGiangDuKien);
            } else {
                Swal.fire('Không tìm thấy thông tin lớp học!', '', 'error');
            }
        } catch (error) {
            console.error('Error during update:', error);
            Swal.fire('Tham gia không thành công!', error.message, 'error');
        } finally {
            loadingElement.style.display = 'none'; // Ẩn màn chờ
        }
    }
}

