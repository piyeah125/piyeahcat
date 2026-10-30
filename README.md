# PIYEAH Assistant

Bản giao diện mới, dùng hai nền và hai logo do Pí Yeah cung cấp. Mặc định sáng, nhớ lựa chọn sáng/tối. Bản gốc trên Desktop và website đang hoạt động không bị thay thế.

## Ảnh minh họa dịch vụ slide

Thêm 4 ảnh PNG, tỷ lệ 16:9 (khuyến nghị 1920 × 1080 px) vào `assets/`:

- `slide-demo-01.png`
- `slide-demo-02.png`
- `slide-demo-03.png`
- `slide-demo-04.png`

Chọn “Xem chi tiết” cạnh “Liên hệ” để xem dịch vụ. Khu ảnh chỉ hiện các file đã có, không hiển thị ảnh lỗi. Hai nút mũi tên chuyển ảnh. Giá hiển thị đúng cấu hình đã chốt: “Chỉ từ 300k/slide”.

`assistant.js` quản lý dịch vụ, liên hệ, chế độ sáng/tối, tin nhắn ngẫu nhiên và hiệu ứng nhẹ. `assistant.css` định nghĩa bố cục và hai chế độ. Hiệu ứng rơi và chuyển tin tự tắt khi bật chế độ giảm chuyển động, dừng khi tab không hoạt động.

## Đưa lên GitHub Pages

Chép toàn bộ nội dung thư mục này vào repository `piyeahcat`, gồm `index.html`, các file `.js`, `.css`, `nameplate.html` và thư mục `assets`. Giữ các file cùng cấp như hiện tại. Không chỉ chép riêng `index.html`.

Để xem đầy đủ trên máy, phục vụ thư mục bằng một máy chủ HTTP tĩnh. Việc đọc thumbnail PDF dùng module/worker nên cần HTTP thay vì mở bằng `file://`.

## Nội dung và tìm kiếm

- `data.js`: dữ liệu và các liên kết tài nguyên giữ lại từ bản cũ.
- `app.js`: tên, từ đồng nghĩa và kết quả tìm kiếm; khai báo 8 công cụ tại `toolEntries`.
- `style.css`: bố cục mới.
- `tools.js`: xử lý file trong trình duyệt, không gửi file đến máy chủ.
- `nameplate.html`: trình tạo bảng tên, sử dụng 4 phôi và font Lato sẵn có.

Tìm kiếm bỏ dấu tiếng Việt, xếp hạng tên/từ đồng nghĩa/mô tả và chấp nhận sai một ký tự ở từ có ít nhất 3 ký tự. Kết quả được chia trang. Trang chính không cuộn; nội dung công cụ dài cuộn trong khung để giữ đủ nút thao tác trên điện thoại.

Nén PNG giữ định dạng, dung lượng có thể không giảm; nếu bản xuất lớn hơn, công cụ giữ file gốc. Đổi tên giữ nguyên dữ liệu ảnh. Chỉnh PDF là chỉnh các trang, không sửa chữ bên trong PDF. Các liên kết Drive/Canva vẫn phụ thuộc quyền truy cập của nguồn.

Mèo GIF tải từ GIPHY theo nguồn của bản gốc. Các thư viện và font kèm giấy phép trong `assets`.
