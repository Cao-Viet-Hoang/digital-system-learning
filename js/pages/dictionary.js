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

  // Chương Mạch tổ hợp ứng dụng — Encoder / Decoder / 7-segment
  { term: "Mạch mã hoá (Encoder)", def: "Mạch tổ hợp biến N đường tín hiệu rời rạc thành mã nhị phân n = ⌈log₂N⌉ bit. Tại mỗi thời điểm chỉ một đường được kích hoạt." },
  { term: "Mạch giải mã (Decoder)", def: "Mạch tổ hợp ngược với encoder: nhận mã nhị phân n bit, kích hoạt đúng một trong 2ⁿ đường ngõ ra." },
  { term: "Mạch mã hoá ưu tiên (Priority Encoder)", def: "Encoder cho phép nhiều ngõ vào cùng tích cực; mã ra luôn ứng với đường có chỉ số cao nhất, các đường nhỏ hơn bị bỏ qua." },
  { term: "Tích cực mức cao (Active-high)", def: "Tín hiệu coi là “đang yêu cầu / đang nhấn” khi ở logic 1. Ký hiệu không có gạch trên." },
  { term: "Tích cực mức thấp (Active-low)", def: "Tín hiệu coi là “đang yêu cầu / đang nhấn” khi ở logic 0. Ký hiệu có gạch trên (ví dụ I̅₃)." },
  { term: "Ngõ cho phép (Enable, E)", def: "Tín hiệu điều khiển bật/tắt cả khối mạch. Khi E không tích cực, mọi ngõ ra của mạch trở về mức không tích cực." },
  { term: "DEMUX (Demultiplexer)", def: "Mạch ngược của MUX: một ngõ vào dữ liệu, n ngõ vào địa chỉ, 2ⁿ ngõ ra — dữ liệu được đưa tới đúng một ngõ ra theo địa chỉ. Có thể tạo từ decoder có Enable." },
  { term: "Minterm", def: "Một tích đầy đủ các biến (mỗi biến xuất hiện đúng một lần, có hoặc không lấy bù) — bằng 1 ở đúng một hàng của bảng chân trị." },
  { term: "Maxterm", def: "Một tổng đầy đủ các biến — bằng 0 ở đúng một hàng của bảng chân trị. Là đối ngẫu của minterm." },
  { term: "BCD đảo", def: "Mã BCD nhưng các bit đã bị đảo (ví dụ ngõ ra 74LS147 ở dạng A̅₃A̅₂A̅₁A̅₀). Dễ ghép với mạch tích cực mức 0." },
  { term: "74LS147", def: "Vi mạch mã hoá ưu tiên 10 đường → 4 đường BCD. Có 9 ngõ vào tích cực mức 0 (I̅₁..I̅₉) và 4 ngõ ra BCD đảo." },
  { term: "74LS148", def: "Vi mạch mã hoá ưu tiên 8 → 3, ngõ vào tích cực mức 0, có ngõ EI cho phép và GS/EO để ghép tầng." },
  { term: "Anode chung (Common Anode – CA)", def: "Kiểu LED 7 đoạn có 7 anode nối chung lên V_CC. Mỗi đoạn sáng khi cathode bị kéo xuống mức 0." },
  { term: "Cathode chung (Common Cathode – CC)", def: "Kiểu LED 7 đoạn có 7 cathode nối chung xuống GND. Mỗi đoạn sáng khi anode được đưa lên mức 1." },
  { term: "Mạch giải mã LED 7 đoạn", def: "Mạch tổ hợp nhận BCD 4 bit và xuất ra 7 tín hiệu điều khiển 7 đoạn a..g để hiển thị số 0–9." },
  { term: "74LS47", def: "IC giải mã BCD → 7 đoạn cho LED Anode chung; ngõ ra tích cực mức 0. Có chân L̅T (lamp test), B̅I (blanking), R̅BI (ripple blanking input)." },
  { term: "74LS48", def: "Tương tự 74LS47 nhưng dành cho LED Cathode chung; ngõ ra tích cực mức 1." },
  { term: "Điện trở hạn dòng", def: "Điện trở nối tiếp với LED (~220–470 Ω) để giới hạn dòng qua LED ở mức an toàn (5–20 mA)." },
  { term: "Lamp Test (L̅T)", def: "Chân kiểm tra đèn trên IC giải mã 7 đoạn: kéo xuống 0 để bật cả 7 đoạn cùng lúc, dùng để kiểm tra LED còn tốt hay không." },
  { term: "Blanking Input (B̅I)", def: "Chân tắt toàn bộ ngõ ra của IC giải mã 7 đoạn; kéo xuống 0 thì 7 đoạn đều tắt, dùng để chớp số hoặc xoá hiển thị." },
  { term: "Ripple Blanking (R̅BI / R̅BO)", def: "Cơ chế ẩn các số 0 đầu/cuối vô nghĩa khi ghép nhiều LED 7 đoạn; chân RBO của IC trước nối vào RBI của IC sau." },
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
