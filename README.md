# Con mèo của Pí Yeah · Minimal

Bản giao diện mới, dùng nền và logo do Pí Yeah cung cấp. Bản gốc trên Desktop và website đang hoạt động không bị thay thế.

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
