// Glossary of important terms.
import { el, clear } from "../utils/dom.js";

const TERMS = [
  { term: "Tín hiệu Analog", def: "Đại lượng thay đổi liên tục (ví dụ: điện áp từ microphone). Có thể nhận bất kỳ giá trị nào trong phạm vi của nó." },
  { term: "Tín hiệu Digital", def: "Tín hiệu chỉ nhận một tập hợp nhỏ các giá trị rời rạc, thường là hai — được hiểu là 0 và 1." },
  { term: "Bit", def: "Chữ số nhị phân — đơn vị thông tin nhỏ nhất của kỹ thuật số; giá trị 0 hoặc 1." },
  { term: "Byte", def: "Nhóm 8 bit. Thường là đơn vị nhỏ nhất có thể địa chỉ hóa trong bộ nhớ." },
  { term: "Nibble", def: "Nhóm 4 bit — đúng bằng một chữ số hex." },
  { term: "Nhị phân (cơ số 2)", def: "Hệ thống số với hai chữ số (0, 1) và lũy thừa của 2 là giá trị vị trí." },
  { term: "Thập phân (cơ số 10)", def: "Hệ thống số với mười chữ số (0–9) và lũy thừa của 10 là giá trị vị trí." },
  { term: "Thập lục phân (cơ số 16)", def: "Hệ thống số với mười sáu chữ số (0–9, A–F) — một chữ số hex = 4 bit." },
  { term: "Logic 0 / Logic 1", def: "Hai trạng thái nhị phân hợp lệ. Dải điện áp phụ thuộc vào công nghệ (ví dụ: CMOS, TTL)." },
  { term: "Vùng không xác định", def: "Dải điện áp giữa logic 0 và logic 1 nơi cổng không thể xác định giá trị đáng tin cậy." },
  { term: "Clock (xung nhịp)", def: "Tín hiệu dao động đều đặn điều phối hệ thống số; dữ liệu được lấy mẫu tại cạnh clock." },
  { term: "Dạng sóng (Waveform)", def: "Đồ thị giá trị tín hiệu theo thời gian." },
  { term: "BCD (Mã thập phân nhị phân)", def: "Mã hóa mỗi chữ số thập phân bằng nhóm 4-bit riêng (0000..1001)." },
  { term: "Mã Gray", def: "Mã hóa nhị phân mà các giá trị liên tiếp chỉ khác nhau đúng một bit." },
  { term: "ASCII", def: "Bảng mã tiêu chuẩn Mỹ cho trao đổi thông tin — ánh xạ ký tự sang mã số 7-bit." },
  { term: "ADC", def: "Bộ chuyển đổi analog-sang-digital — lấy mẫu điện áp liên tục và xuất số nhị phân." },
  { term: "DAC", def: "Bộ chuyển đổi digital-sang-analog — nhận số nhị phân và tạo ra điện áp tương ứng." },
  { term: "MSB / LSB", def: "Bit quan trọng nhất / bit ít quan trọng nhất — bit ngoài cùng bên trái / phải của giá trị nhị phân." },
  { term: "Màn hình 7 đoạn", def: "Màn hình gồm bảy đoạn LED (a..g) có thể hiển thị chữ số 0–9." },
  { term: "Nibble (trong BCD)", def: "Trong ngữ cảnh BCD, nhóm 4-bit biểu diễn đúng một chữ số thập phân." },
];

export function renderDictionary(container) {
  clear(container);
  const inner = el("div", { class: "content-inner" });
  container.appendChild(inner);
  inner.appendChild(el("h1", { text: "Bảng Chú Giải" }));
  inner.appendChild(
    el("p", { class: "text-2", text: "Định nghĩa ngắn gọn, dễ hiểu cho các thuật ngữ quan trọng trong chương này." }),
  );

  const search = el("input", {
    class: "input input-mono",
    type: "text",
    placeholder: "Tìm thuật ngữ…",
    style: { maxWidth: "320px", marginBottom: "16px" },
  });
  inner.appendChild(search);
  const list = el("div", { class: "stack" });
  inner.appendChild(list);

  function rerender() {
    const q = search.value.trim().toLowerCase();
    clear(list);
    TERMS.filter((t) => !q || t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q)).forEach((t) => {
      list.appendChild(
        el("div", { class: "card" }, [
          el("div", { style: { fontWeight: "600", marginBottom: "4px" }, text: t.term }),
          el("div", { class: "text-2", text: t.def }),
        ]),
      );
    });
    if (!list.children.length) {
      list.appendChild(el("div", { class: "alert alert-info", text: "Không tìm thấy thuật ngữ nào khớp." }));
    }
  }
  search.addEventListener("input", rerender);
  rerender();
}
