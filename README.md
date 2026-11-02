# Sort Algorithm Visualize

Mô phỏng từng bước các thuật toán sắp xếp, kèm code C++ với dòng đang chạy được tô sáng. Mỗi bước có một câu giải thích bằng số liệu cụ thể của mảng bạn nhập.

| Thuật toán | Trang | Code C++ | Thời gian | Bộ nhớ |
|---|---|---|---|---|
| Insertion Sort | `insertion-sort.html` | `cpp/insertion_sort.cpp` | O(n²) | O(1) |
| Merge Sort | `merge-sort.html` | `cpp/merge_sort.cpp` | O(n log n) | O(n) |
| Quick Sort | `quick-sort.html` | `cpp/quick_sort.cpp` | O(n log n) trung bình, O(n²) xấu nhất | O(log n) |
| Heap Sort | `heap-sort.html` | `cpp/heap_sort.cpp` | O(n log n) | O(1) |

## Cách xem

Mở `index.html` bằng trình duyệt (bấm đúp vào file là được, không cần cài gì, không cần mạng).

Trong mỗi trang:

- **Tiếp / Lùi** hoặc phím mũi tên trái, phải: đi từng bước.
- **Tự chạy** hoặc phím cách: chạy tự động, chỉnh tốc độ bằng thanh "Tốc độ".
- Thanh trượt giữa: nhảy tới bước bất kỳ.
- Ô **Mảng**: nhập 1 đến 12 số nguyên, cách nhau bằng dấu phẩy, rồi bấm "Áp dụng". Nút "Ngẫu nhiên" tạo mảng mới.

## Đưa lên GitHub Pages

1. Đẩy repo lên GitHub.
2. Vào Settings, chọn Pages, mục Source chọn "Deploy from a branch", chọn nhánh `main` và thư mục `/ (root)`.
3. Sau ít phút trang chạy tại `https://<tên-bạn>.github.io/<tên-repo>/`.

## Chạy code C++

```bash
g++ -std=c++17 cpp/heap_sort.cpp -o heap_sort && ./heap_sort
```

## Kiểm tra

```bash
node test/test.js
```

Lệnh này chạy mỗi thuật toán trên hơn 200 mảng (có phần tử trùng, đã sắp xếp, ngược, ngẫu nhiên) và kiểm tra:
kết quả cuối cùng đã sắp xếp, mọi dòng code hiển thị đều có trong file `.cpp`, và không bước nào bị lỗi khi vẽ.

## Cấu trúc

```
index.html, *-sort.html     các trang
assets/player.js            khung mô phỏng dùng chung (nút bước, tô dòng code, nhập mảng)
assets/style.css            giao diện sáng và tối (theo hệ thống)
assets/js/<thuật toán>.js   code hiển thị, bộ sinh các bước, phần vẽ
cpp/                        code C++ chạy được
test/test.js                kiểm tra
```
