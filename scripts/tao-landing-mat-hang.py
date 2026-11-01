"""
Sinh các landing "gửi <mặt hàng> đi Mỹ" từ khuôn public/van-chuyen-hang-di-my/index.html.

Mỗi trang ra public/<slug>/index.html, dùng chung ảnh, pixel, GTM, ô tính giá và đo
lường với trang khuôn — chỉ thay chữ theo mặt hàng. Danh sách slug ghi ra
src/data/landing-mat-hang.json để next.config.ts (rewrite) và sitemap.ts đọc chung.

Sửa trang khuôn (đổi giá RATE, đổi số, sửa FAQ chung…) thì chạy lại:
    python3 scripts/tao-landing-mat-hang.py
Đừng sửa tay public/gui-*-di-my/index.html — lần chạy sau sẽ ghi đè.

Luật nhận hàng lấy theo src/data/hang-tuyen.json (file training của chủ). Không ghi số
tiền phụ thu lên trang — chỉ nói "có phụ thu, báo trước".
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
KHUON = ROOT / "public/van-chuyen-hang-di-my/index.html"
SITE = "https://minhthienlogs.com"
IMG = "/van-chuyen-hang-di-my/images/"
REAL = "/images/real/"

ICONS = [
    '<path d="M21 8 12 3 3 8v8l9 5 9-5z"></path><path d="m3 8 9 5 9-5"></path><path d="M12 13v8"></path>',
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
    '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>',
    '<circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>',
]
ICON_COLORS = [("#E3F6F3", "#0E7A6C"), ("#FDE8E8", "#C8403F"), ("#FDF1DD", "#9A5B05"), ("#E3F6F3", "#0E7A6C")]

# Đoạn FAQ chung giữ nguyên ở mọi trang; hai câu đầu của khuôn (thuốc tây, thịt-trứng-sữa)
# được thay bằng FAQ riêng của mặt hàng.
FAQ_CHUNG_SAU = "Bao lâu thì người nhận có hàng?"

T = [
    dict(
        slug="gui-yen-di-my", ten="yến",
        title="Gửi yến sào đi Mỹ 3–5 ngày, từ 79k/kg",
        desc="Gửi yến sào đi Mỹ: yến tinh chế, yến thô, yến hũ. Đóng hộp kín, khai báo đúng, giao tận nhà 3–5 ngày. Lấy hàng miễn phí TP.HCM. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">yến sào</span> đi Mỹ, tới tay người thân 3–5 ngày',
        lead="Yến tinh chế, yến thô, yến chưng hũ – Minh Thiện nhận gửi bình thường, đóng hộp chống ẩm, khai báo rõ ràng để đi thẳng tới nhà người nhận.",
        rows=[("Yến tinh chế, yến thô", "Nhận gửi"), ("Yến chưng đóng hũ", "Nhận gửi")],
        h2="Yến nào cũng gửi được", sp="Mỗi kiện yến được cân, chụp ảnh và đóng hộp kín trước mặt bạn.",
        cards=[("Yến tinh chế", "Tổ yến đã làm sạch lông, đóng hộp giấy hoặc hộp nhựa."),
               ("Yến thô, yến rút lông", "Đóng túi kín, chèn chống bể từng tổ."),
               ("Yến chưng hũ", "Hũ thủy tinh quấn chống sốc, chèn chống đổ vỡ."),
               ("Quà biếu", "Hộp quà yến, đông trùng, sâm gửi kèm chung một kiện.")],
        pill="Yến / đông trùng", note="Yến tinh chế nhận gửi bình thường; yến chưng hũ là chất lỏng nên có phụ thu, nhân viên báo trước. Giá trên là mức ước tính từ.",
        img=(REAL + "yen-sao-kho.jpg", "Yến sào khô đóng hộp", "Yến sào đóng hộp, sẵn sàng gửi"),
        faqs=[("Gửi yến đi Mỹ có bị hải quan giữ không?", "Yến tinh chế đóng hộp kín, khai báo đúng tên hàng thì đi bình thường. Minh Thiện hướng dẫn số lượng mỗi kiện và cách khai để hàng thông quan suôn sẻ."),
              ("Yến chưng hũ gửi được không?", "Được. Hũ yến là chất lỏng nên có phụ thu riêng và được quấn chống sốc từng hũ. Nhân viên báo phụ thu trước khi nhận hàng."),
              ("Gửi bao nhiêu yến là vừa?", "Gửi theo nhu cầu biếu tặng, dùng trong gia đình. Gửi số lượng lớn để kinh doanh thì gọi trước để được tư vấn cách khai báo.")],
        cta="Cần gửi yến đi Mỹ?",
    ),
    dict(
        slug="gui-kho-ca-di-my", ten="khô cá",
        title="Gửi khô cá đi Mỹ 3–5 ngày, từ 79k/kg",
        desc="Gửi khô cá, cá khô, khô cá dứa, cá chỉ vàng đi Mỹ. Hút chân không miễn phí, khử mùi, giao tận nhà 3–5 ngày. Lấy hàng miễn phí TP.HCM. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">khô cá</span> đi Mỹ, hút chân không, không bay mùi',
        lead="Khô cá dứa, cá lóc, cá chỉ vàng, cá sặc, khô mực – Minh Thiện nhận gửi bình thường, hút chân không miễn phí để khô giữ vị và không bay mùi suốt đường đi.",
        rows=[("Khô cá, khô mực", "Nhận gửi"), ("Hút chân không", "Miễn phí")],
        h2="Khô cá quê nhà, đóng gói đúng chuẩn", sp="Khô phải khô hẳn, không mốc – Minh Thiện kiểm, hút chân không và dán nhãn từng gói.",
        cards=[("Khô cá dứa, cá lóc", "Đặc sản miền Tây, hút chân không từng gói."),
               ("Cá chỉ vàng, cá sặc", "Khô tẩm hay khô mặn đều nhận."),
               ("Khô mực", "Mực khô, mực một nắng đã sấy khô."),
               ("Đặc sản gửi kèm", "Mắm, bánh tráng, đồ khô quê gửi chung thùng.")],
        pill="Khô cá / khô mực", note="Khô cá, khô mực nhận gửi bình thường, hút chân không miễn phí. Mắm gửi kèm là chất lỏng, có phụ thu riêng. Giá trên là mức ước tính từ.",
        img=(REAL + "thuc-pham-kho-dac-san.jpg", "Khô cá, khô mực, tôm khô đặc sản", "Khô cá, khô mực, tôm khô đặc sản"),
        faqs=[("Gửi khô cá đi Mỹ được không?", "Được. Cá khô, khô mực là thực phẩm đã qua chế biến, Mỹ cho nhập. Điều kiện: khô hẳn, không mốc, đóng gói kín và có nhãn – Minh Thiện lo phần đóng gói."),
              ("Gửi khô cá có bị bay mùi không?", "Không. Từng gói được hút chân không, bọc thêm lớp túi rồi mới đóng thùng, nên mùi không lọt ra ngoài và không ám sang hàng khác."),
              ("Khô cá một nắng gửi được không?", "Khô một nắng còn ẩm, dễ mốc trên đường. Nên phơi hoặc sấy khô hẳn trước khi gửi. Gọi để nhân viên xem hàng và tư vấn.")],
        cta="Cần gửi khô cá đi Mỹ?",
    ),
    dict(
        slug="gui-tom-kho-di-my", ten="tôm khô",
        # Trang này đã làm lại bằng tay (tông cam/san hô) — script không ghi đè.
        viet_tay=True,
        title="Gửi tôm khô đi Mỹ 3–5 ngày, từ 79k/kg",
        desc="Gửi tôm khô, tép khô, khô tôm Cà Mau đi Mỹ. Hút chân không miễn phí, giao tận nhà 3–5 ngày. Lấy hàng miễn phí TP.HCM. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">tôm khô</span> đi Mỹ, giữ nguyên màu đỏ, vị ngọt',
        lead="Tôm khô Cà Mau, tép khô, tôm đất – Minh Thiện nhận gửi bình thường, hút chân không miễn phí để tôm không ẩm, không mất màu khi tới tay người nhận.",
        rows=[("Tôm khô, tép khô", "Nhận gửi"), ("Hút chân không", "Miễn phí")],
        h2="Tôm khô loại nào cũng gửi được", sp="Hút chân không từng gói, chèn chặt trong thùng để tôm không gãy vụn.",
        cards=[("Tôm khô Cà Mau", "Tôm đất, tôm sú khô loại 1 làm quà biếu."),
               ("Tép khô, ruốc khô", "Đóng túi nhỏ, hút chân không kỹ."),
               ("Tôm khô làm quà", "Hộp quà, túi zip có nhãn của cơ sở."),
               ("Hải sản khô gửi kèm", "Khô cá, khô mực gửi chung một thùng.")],
        pill="Tôm khô / hải sản khô", note="Tôm khô nhận gửi bình thường, hút chân không miễn phí. Giá trên là mức ước tính từ.",
        img=(REAL + "hang-thuc-pham-dong-goi.jpg", "Tôm khô hút chân không, có gói hút ẩm", "Tôm khô hút chân không, kèm gói hút ẩm"),
        faqs=[("Gửi tôm khô đi Mỹ có bị cấm không?", "Không. Tôm khô là hải sản đã chế biến, gửi đi Mỹ được. Chỉ cần khô hẳn, không mốc, đóng gói kín – Minh Thiện hút chân không và dán nhãn giúp bạn."),
              ("Tôm khô có bị ẩm, mất màu khi gửi không?", "Hút chân không giữ tôm khô ráo suốt hành trình. Bay nhanh 3–5 ngày nên tôm tới nơi vẫn giữ màu và vị."),
              ("Gửi tôm khô số lượng lớn để bán được không?", "Được. Hàng kinh doanh số lượng lớn gọi trước để được tư vấn cách khai báo và báo giá theo lô.")],
        cta="Cần gửi tôm khô đi Mỹ?",
    ),
    dict(
        slug="gui-hoa-gia-di-my", ten="hoa giả",
        title="Gửi hoa giả đi Mỹ, hoa lụa, hoa trang trí",
        desc="Gửi hoa giả, hoa lụa, hoa trang trí tiệm nail, đám cưới đi Mỹ. Đóng thùng chống bẹp, tính cước theo kích thước hợp lý. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">hoa giả</span> đi Mỹ, tới nơi không bẹp, không gãy',
        lead="Hoa lụa, hoa giả trang trí tiệm nail, nhà hàng, đám cưới, bàn thờ – Minh Thiện đóng thùng chống bẹp và tư vấn cách xếp để cước theo kích thước không bị đội.",
        rows=[("Hoa lụa, hoa giả", "Nhận gửi"), ("Đóng thùng chống bẹp", "Miễn phí")],
        h2="Hoa nhẹ mà to – xếp đúng cách để đỡ cước", sp="Hoa giả nhẹ nhưng chiếm chỗ, nên cước thường tính theo kích thước thùng. Minh Thiện xếp gọn giúp bạn.",
        cards=[("Hoa lụa trang trí", "Cành, bó, chậu hoa giả cho nhà và tiệm."),
               ("Hoa cưới, cổng hoa", "Tháo rời được thì tháo để thùng nhỏ lại."),
               ("Hoa thờ cúng", "Hoa sen, hoa mai, hoa đào giả dịp Tết."),
               ("Phụ kiện trang trí", "Lồng đèn, dây treo, đồ decor gửi kèm.")],
        seller=dict(label="Dành cho tiệm nail, nhà hàng, tiệc cưới", h2="Trang trí tiệm bên Mỹ bằng hàng Việt",
                    p="Hoa giả, đồ decor ở Việt Nam rẻ và đẹp hơn nhiều. Minh Thiện gom hàng từ nhiều chỗ mua, đóng chung thùng và giao tận tiệm.",
                    b=[("Gom hàng", "nhận hàng từ nhiều shop về kho, đóng chung"), ("Xếp gọn", "tháo cành, lồng thùng để giảm cân quy đổi"), ("Giao tận tiệm", "có mã tra cứu từng thùng")]),
        pill="Hoa giả / decor", note="Hoa giả nhận gửi bình thường. Hàng nhẹ mà to nên thường tính theo cân quy đổi – nhập kích thước thùng để xem. Giá trên là mức ước tính từ.",
        dims=True,
        img=(REAL + "kien-hang-carton.jpg", "Thùng hàng dán kín, ghi mã", "Thùng hàng dán kín, ghi mã từng kiện"),
        faqs=[("Hoa giả gửi đi Mỹ tính cước thế nào?", "Theo số lớn hơn giữa cân thực và cân quy đổi (Dài × Rộng × Cao ÷ 5000). Hoa giả nhẹ nên thường tính theo kích thước – Minh Thiện xếp gọn, tháo cành để thùng nhỏ lại."),
              ("Hoa giả có bị bẹp khi tới nơi không?", "Thùng được chèn giấy, xếp hoa theo lớp và gia cố góc. Bạn được chụp ảnh thùng trước khi gửi."),
              ("Hoa có cành gỗ, cành khô thật gửi được không?", "Gọi trước để nhân viên xem. Cành cây, đồ dính đất thật có thể bị kiểm dịch – hoa lụa, hoa nhựa thì đi bình thường.")],
        cta="Cần gửi hoa giả đi Mỹ?",
    ),
    dict(
        slug="gui-hang-cong-kenh-di-my", ten="hàng cồng kềnh",
        title="Gửi hàng cồng kềnh đi Mỹ, nội thất, bàn thờ, tủ",
        desc="Gửi hàng cồng kềnh đi Mỹ: nội thất, bàn thờ, tủ, nhạc cụ, máy móc. Đóng thùng chắc chắn, đường thuỷ từ 79k/kg. Lấy hàng miễn phí TP.HCM. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">hàng cồng kềnh</span> đi Mỹ, đường thuỷ từ 79k/kg',
        lead="Bàn thờ, tủ, bàn ghế, nhạc cụ, máy móc – Minh Thiện nhận hàng nặng và to, đóng thùng chắc chắn, tư vấn đi đường thuỷ để tiết kiệm cước.",
        rows=[("Nội thất, bàn thờ, tủ", "Nhận gửi"), ("Nhạc cụ, máy móc", "Nhận gửi")],
        h2="Hàng to, hàng nặng – Minh Thiện nhận", sp="Đo, cân và đóng thùng tại kho. Bạn biết trước cước trước khi gửi.",
        cards=[("Bàn thờ, tủ thờ", "Gỗ, đồng, đá – chèn xốp, gia cố từng góc."),
               ("Nội thất", "Bàn ghế, tủ, kệ – tháo rời được thì tháo cho gọn."),
               ("Nhạc cụ", "Đàn, trống, đàn piano đóng thùng chống va đập."),
               ("Máy móc, linh kiện", "Máy móc gia đình, thiết bị kinh doanh.")],
        pill="Hàng cồng kềnh", note="Hàng cồng kềnh tính theo số lớn hơn giữa cân thực và cân quy đổi. Đường thuỷ tiết kiệm nhất cho hàng to; gọi để hỏi lịch tàu. Giá trên là mức ước tính từ.",
        dims=True,
        img=(REAL + "dan-piano-gui-di.jpg", "Đàn organ trước khi đóng thùng", "Đàn organ trước khi đóng thùng"),
        faqs=[("Hàng cồng kềnh gửi đi Mỹ tính cước thế nào?", "Theo số lớn hơn giữa cân thực và cân quy đổi (Dài × Rộng × Cao ÷ 5000). Nhập kích thước ở ô tính giá phía trên để ước tính, hoặc gửi ảnh và số đo qua Zalo để được báo giá."),
              ("Đi đường thuỷ hay đường bay rẻ hơn?", "Hàng to và nặng đi đường thuỷ rẻ hơn nhiều, đổi lại thời gian lâu hơn. Gọi để hỏi lịch tàu và so giá hai đường cho món hàng của bạn."),
              ("Có lấy hàng to tận nhà không?", "Trong TP.HCM có lấy hàng miễn phí. Hàng quá khổ cần xe tải thì nhân viên báo trước chi phí. Ở tỉnh gửi chành xe về kho 5/5 Nguyễn Văn Vĩnh.")],
        cta="Cần gửi hàng cồng kềnh đi Mỹ?",
    ),
    dict(
        slug="gui-thuoc-tay-di-my", ten="thuốc tây",
        title="Gửi thuốc tây đi Mỹ 3–5 ngày, tư vấn khai báo",
        desc="Gửi thuốc tây, thuốc kê đơn, thực phẩm chức năng đi Mỹ cho người thân. Tư vấn số lượng và cách khai báo. Giao tận nhà 3–5 ngày. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">thuốc tây</span> đi Mỹ cho người thân, 3–5 ngày',
        lead="Thuốc kê đơn, thuốc thông dụng, thực phẩm chức năng – Minh Thiện nhận gửi và tư vấn số lượng, cách khai báo cho từng loại thuốc trước khi gửi.",
        rows=[("Thuốc tây, thuốc kê đơn", "Nhận, có điều kiện"), ("Thực phẩm chức năng", "Nhận, có điều kiện")],
        h2="Gửi thuốc cho người thân bên Mỹ", sp="Thuốc là mặt hàng hải quan Mỹ kiểm kỹ. Gọi trước để được tư vấn đúng loại thuốc bạn định gửi.",
        cards=[("Thuốc kê đơn", "Kèm toa thuốc của bác sĩ, gửi số lượng dùng cá nhân."),
               ("Thuốc thông dụng", "Thuốc cảm, đau đầu, tiêu hoá – để nguyên hộp."),
               ("Thực phẩm chức năng", "Vitamin, thuốc bổ còn nguyên tem nhãn."),
               ("Thuốc Nam, thuốc Bắc", "Thảo mộc khô, cao – gọi để được tư vấn.")],
        pill="Thuốc / TPCN", note="Thuốc / TPCN có phụ thu theo kí và có rủi ro bị kiểm tra ở hải quan Mỹ – nhân viên báo trước khi nhận. Giá trên là mức ước tính từ.",
        img=(REAL + "thuoc-tay.jpg", "Thuốc tây để nguyên hộp", "Thuốc để nguyên hộp, nguyên nhãn"),
        faqs=[("Gửi thuốc tây đi Mỹ có bị giữ ở hải quan không?", "Thuốc là nhóm hàng hải quan Mỹ có thể kiểm tra, nên vẫn có rủi ro. Minh Thiện hướng dẫn số lượng và cách khai báo phù hợp cho từng loại để hàng thông quan suôn sẻ nhất. Nhân viên nói rõ rủi ro trước khi nhận."),
              ("Gửi thuốc cần chuẩn bị gì?", "Để nguyên hộp, nguyên vỉ, còn nhãn và hạn dùng. Thuốc kê đơn nên kèm toa của bác sĩ. Gửi số lượng vừa đủ dùng cá nhân."),
              ("Gửi thuốc có tốn thêm phí không?", "Có phụ thu theo kí cho thuốc và thực phẩm chức năng. Nhân viên báo rõ trước khi nhận hàng, không phát sinh sau.")],
        cta="Cần gửi thuốc đi Mỹ?",
    ),
    dict(
        slug="gui-cu-kieu-di-my", ten="củ kiệu",
        title="Gửi củ kiệu đi Mỹ, đóng hũ chống tràn",
        desc="Gửi củ kiệu ngâm, củ kiệu tôm khô đi Mỹ ăn Tết. Đóng hũ chống tràn, quấn chống sốc, giao tận nhà 3–5 ngày. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">củ kiệu</span> đi Mỹ, đóng hũ kín, không tràn nước',
        lead="Củ kiệu ngâm chua ngọt, củ kiệu tôm khô cho người thân ăn Tết – Minh Thiện bọc kín miệng hũ, quấn chống sốc và chèn chặt để không tràn, không vỡ.",
        rows=[("Củ kiệu ngâm đóng hũ", "Nhận gửi"), ("Chất lỏng", "Có phụ thu")],
        h2="Món Tết quê nhà, gửi kịp người thân", sp="Củ kiệu ngâm có nước nên tính là chất lỏng. Minh Thiện đóng gói kỹ để hũ không rò.",
        cards=[("Củ kiệu ngâm", "Hũ nhựa hoặc thủy tinh, quấn màng kín miệng."),
               ("Củ kiệu tôm khô", "Đóng hũ, bọc túi kín bên ngoài."),
               ("Dưa món, dưa kiệu", "Đồ chua ngày Tết gửi chung thùng."),
               ("Bánh mứt Tết gửi kèm", "Bánh kẹo, mứt, hạt dưa gửi một lần.")],
        pill="Củ kiệu / đồ ngâm", note="Củ kiệu ngâm có nước nên có phụ thu chất lỏng mỗi kiện – nhân viên báo trước. Giá trên là mức ước tính từ.",
        img=(REAL + "thuc-pham-kho-gui-di.jpg", "Đặc sản đóng hũ, đóng gói trước khi gửi", "Đặc sản đóng hũ, đóng gói trước khi gửi"),
        faqs=[("Củ kiệu gửi đi Mỹ được không?", "Được. Củ kiệu ngâm là thực phẩm đã chế biến, đóng hũ kín. Vì có nước nên tính là chất lỏng và có phụ thu mỗi kiện."),
              ("Làm sao để hũ củ kiệu không tràn, không vỡ?", "Miệng hũ được quấn màng, bọc túi kín, rồi quấn xốp chống sốc và chèn chặt trong thùng. Hũ nhựa an toàn hơn hũ thủy tinh."),
              ("Gửi củ kiệu ăn Tết thì gửi lúc nào?", "Bay nhanh 3–5 ngày làm việc. Gửi trước Tết khoảng 2 tuần để tránh dồn hàng cuối năm.")],
        cta="Cần gửi củ kiệu đi Mỹ?",
    ),
    dict(
        slug="gui-son-mong-tay-di-my", ten="sơn móng tay",
        title="Gửi sơn móng tay đi Mỹ cho tiệm nail",
        desc="Gửi sơn móng tay, nước sơn, dụng cụ nail đi Mỹ cho tiệm nail và người thân. Tư vấn tuyến gửi, đóng gói chống vỡ. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">sơn móng tay</span> đi Mỹ cho tiệm nail',
        lead="Nước sơn móng, dụng cụ, móng úp, nailbox – Minh Thiện nhận gửi và đóng gói chống vỡ từng chai. Sơn có cồn nên có phụ thu, nhân viên báo trước.",
        rows=[("Sơn móng tay", "Nhận, có phụ thu"), ("Móng úp, nailbox", "Nhận gửi")],
        h2="Hàng nail từ Việt Nam sang tiệm bên Mỹ", sp="Từng chai được quấn chống sốc, xếp đứng và chèn chặt trong thùng.",
        cards=[("Sơn móng tay", "Nước sơn thường, sơn bóng, sơn lót."),
               ("Móng úp, nailbox", "Móng gắn sẵn, móng giả – nhận gửi bình thường."),
               ("Dụng cụ nail", "Kềm, dũa, cọ vẽ, đá đính móng."),
               ("Mỹ phẩm gửi kèm", "Kem, dưỡng da tay gửi chung thùng.")],
        seller=dict(label="Dành cho chủ tiệm nail", h2="Nhập hàng nail từ Việt Nam về tiệm",
                    img="tiem-nail.jpg", alt="Thợ làm móng trong tiệm nail",
                    p="Mua sơn, móng, dụng cụ ở Việt Nam rồi gửi sang tiệm bên Mỹ. Minh Thiện gom hàng từ nhiều shop, đóng chung thùng, giao tận tiệm.",
                    b=[("Gom hàng", "nhận hàng từ nhiều shop về kho, đóng chung"), ("Chống vỡ", "quấn từng chai, xếp đứng trong thùng"), ("Giao tận tiệm", "có mã tra cứu từng thùng")]),
        pill="Sơn / hàng nail", note="Sơn móng tay có cồn nên có phụ thu theo kí – nhân viên báo trước và tư vấn số lượng mỗi kiện. Giá trên là mức ước tính từ.",
        img=(REAL + "kien-hang-carton.jpg", "Thùng hàng dán kín, ghi mã", "Thùng hàng dán kín, ghi mã từng kiện"),
        faqs=[("Sơn móng tay gửi đi Mỹ được không?", "Được. Sơn móng tay có cồn nên đi tuyến phù hợp và có phụ thu theo kí. Gọi trước để nhân viên tư vấn số lượng mỗi kiện."),
              ("Chai sơn có bị vỡ, rò khi gửi không?", "Từng chai được siết nắp, quấn chống sốc, xếp đứng và chèn chặt. Bạn được chụp ảnh thùng trước khi gửi."),
              ("Tiệm nail mua hàng nhiều shop, gom chung được không?", "Được. Cho shop giao về kho 5/5 Nguyễn Văn Vĩnh, Minh Thiện nhận, kiểm và đóng chung một thùng rồi báo lại cho bạn.")],
        cta="Cần gửi sơn móng tay đi Mỹ?",
    ),
    dict(
        slug="gui-son-gel-di-my", ten="sơn gel",
        title="Gửi sơn gel đi Mỹ cho tiệm nail",
        desc="Gửi sơn gel, gel úp móng, base top đi Mỹ cho tiệm nail. Đóng gói chống vỡ từng chai, giao tận tiệm. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">sơn gel</span> đi Mỹ, giao tận tiệm nail',
        lead="Sơn gel, base, top, gel đắp, bột nhúng – Minh Thiện nhận gửi và đóng gói chống vỡ từng chai. Hàng có cồn nên có phụ thu, nhân viên báo trước.",
        rows=[("Sơn gel, base, top", "Nhận, có phụ thu"), ("Đèn hơ gel", "Nhận gửi")],
        h2="Gel Việt Nam, tiệm bên Mỹ dùng ngay", sp="Từng chai được siết nắp, quấn chống sốc và xếp đứng trong thùng.",
        cards=[("Sơn gel màu", "Bộ màu, gel mắt mèo, gel nhũ."),
               ("Base, top, gel đắp", "Chai lớn, chai nhỏ đều nhận."),
               ("Đèn hơ gel", "Đèn UV/LED không có pin rời."),
               ("Dụng cụ nail", "Cọ, dũa, móng úp gửi chung thùng.")],
        seller=dict(label="Dành cho chủ tiệm nail", h2="Nhập gel từ Việt Nam về tiệm",
                    img="tiem-nail.jpg", alt="Thợ làm móng trong tiệm nail",
                    p="Gel, móng, dụng cụ mua ở Việt Nam, gửi thẳng sang tiệm. Minh Thiện gom hàng từ nhiều shop, đóng chung thùng, giao tận tiệm.",
                    b=[("Gom hàng", "nhận hàng từ nhiều shop về kho, đóng chung"), ("Chống vỡ", "quấn từng chai, xếp đứng trong thùng"), ("Giao tận tiệm", "có mã tra cứu từng thùng")]),
        pill="Sơn gel / hàng nail", note="Sơn gel có cồn nên có phụ thu theo kí – nhân viên báo trước và tư vấn số lượng mỗi kiện. Giá trên là mức ước tính từ.",
        img=(REAL + "kien-hang-carton.jpg", "Thùng hàng dán kín, ghi mã", "Thùng hàng dán kín, ghi mã từng kiện"),
        faqs=[("Sơn gel gửi đi Mỹ được không?", "Được. Sơn gel có cồn nên đi tuyến phù hợp và có phụ thu theo kí. Gọi trước để nhân viên tư vấn số lượng mỗi kiện."),
              ("Đèn hơ gel gửi được không?", "Được nếu đèn không kèm pin rời. Đèn có pin sạc gắn trong máy vẫn đi được nhưng có rủi ro ở hải quan Mỹ – nhân viên báo trước."),
              ("Gửi gel số lượng lớn cho tiệm được không?", "Được. Hàng kinh doanh số lượng lớn gọi trước để được tư vấn cách khai báo và báo giá theo lô.")],
        cta="Cần gửi sơn gel đi Mỹ?",
    ),
    dict(
        slug="gui-bang-quang-cao-di-my", ten="bảng quảng cáo",
        title="Gửi bảng quảng cáo đi Mỹ, bảng hiệu, hộp đèn",
        desc="Gửi bảng quảng cáo, bảng hiệu, hộp đèn, chữ nổi đi Mỹ cho tiệm và doanh nghiệp. Đóng thùng chống va đập, tính cước theo kích thước. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">bảng quảng cáo</span> đi Mỹ cho tiệm, cửa hàng',
        lead="Bảng hiệu, hộp đèn, chữ nổi, bảng mica, standee – làm ở Việt Nam rẻ hơn nhiều. Minh Thiện đóng thùng chống va đập và giao tận tiệm bên Mỹ.",
        rows=[("Bảng hiệu, hộp đèn", "Nhận gửi"), ("Chữ nổi, bảng mica", "Nhận gửi")],
        h2="Làm bảng ở Việt Nam, treo ở Mỹ", sp="Bảng to được đo, đóng khung bảo vệ và chèn chống trầy trước khi gửi.",
        cards=[("Bảng hiệu, hộp đèn", "Bảng alu, mica, hộp đèn LED gắn sẵn."),
               ("Chữ nổi", "Chữ inox, chữ mica, chữ có đèn LED."),
               ("Standee, poster", "Bảng đứng, tranh in, banner cuộn."),
               ("Đèn LED kèm theo", "Dây LED, nguồn điện gửi chung thùng.")],
        seller=dict(label="Dành cho tiệm và doanh nghiệp", h2="Bảng hiệu cho tiệm nail, nhà hàng bên Mỹ",
                    p="Đặt làm bảng ở xưởng Việt Nam, cho xưởng giao về kho. Minh Thiện đo, đóng khung bảo vệ và gửi tới tận tiệm.",
                    b=[("Nhận từ xưởng", "xưởng giao về kho, Minh Thiện kiểm hàng"), ("Đóng khung", "chèn góc, chống trầy mặt bảng"), ("Báo cước trước", "theo cân thực hoặc kích thước")]),
        pill="Bảng quảng cáo", note="Bảng quảng cáo thường tính theo cân quy đổi – nhập kích thước thùng để xem. Hàng to nên hỏi thêm giá đường thuỷ. Giá trên là mức ước tính từ.",
        dims=True,
        img=(REAL + "kien-hang-carton.jpg", "Thùng hàng dán kín, ghi mã", "Thùng hàng dán kín, ghi mã từng kiện"),
        faqs=[("Bảng quảng cáo gửi đi Mỹ tính cước thế nào?", "Theo số lớn hơn giữa cân thực và cân quy đổi (Dài × Rộng × Cao ÷ 5000). Bảng to thường tính theo kích thước – gửi số đo qua Zalo để được báo giá chính xác."),
              ("Bảng có đèn LED gửi được không?", "Được. Bảng, hộp đèn gắn LED và nguồn điện đi bình thường. Chỉ không nhận pin rời và sạc dự phòng."),
              ("Bảng có bị trầy, gãy khi tới nơi không?", "Mặt bảng được dán màng, chèn góc và đóng khung bảo vệ. Bạn được chụp ảnh kiện trước khi gửi.")],
        cta="Cần gửi bảng quảng cáo đi Mỹ?",
    ),
    dict(
        slug="gui-hat-dua-di-my", ten="hạt dưa",
        title="Gửi hạt dưa đi Mỹ 3–5 ngày, từ 79k/kg",
        desc="Gửi hạt dưa, hạt bí, hạt hướng dương, bánh mứt Tết đi Mỹ. Đóng gói kín, giao tận nhà 3–5 ngày. Lấy hàng miễn phí TP.HCM. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">hạt dưa</span> đi Mỹ, kịp Tết cho người thân',
        lead="Hạt dưa, hạt bí, hạt hướng dương, hạt điều cùng bánh mứt Tết – Minh Thiện nhận gửi bình thường, đóng gói kín để hạt giòn, không ẩm.",
        rows=[("Hạt dưa, hạt bí rang", "Nhận gửi"), ("Bánh mứt Tết", "Nhận gửi")],
        h2="Hộp mứt Tết đủ vị, gửi một lần", sp="Hạt rang và bánh mứt đóng chung một thùng, chèn chặt để không vỡ hộp.",
        cards=[("Hạt dưa", "Hạt dưa đỏ, hạt dưa rang muối."),
               ("Hạt bí, hướng dương", "Hạt rang chín, đóng túi kín."),
               ("Hạt điều, đậu phộng", "Đặc sản đóng gói, làm quà biếu."),
               ("Mứt Tết", "Mứt gừng, mứt dừa, bánh kẹo gửi kèm.")],
        pill="Hạt / bánh mứt Tết", note="Hạt rang, bánh mứt nhận gửi bình thường. Giá trên là mức ước tính từ.",
        img=(REAL + "banh-keo-dac-san.jpg", "Bánh kẹo, đặc sản xếp trước khi đóng thùng", "Bánh kẹo, đặc sản xếp trước khi đóng thùng"),
        faqs=[("Hạt dưa gửi đi Mỹ được không?", "Được. Hạt dưa, hạt bí, hướng dương đã rang chín là đồ khô, gửi bình thường. Hạt sống để trồng thì là hạt giống – gọi để được tư vấn riêng."),
              ("Hạt dưa có bị ẩm, mất giòn không?", "Hạt được đóng túi kín, bọc thêm lớp túi ngoài. Bay nhanh 3–5 ngày nên tới nơi vẫn giòn."),
              ("Gửi đồ Tết đi Mỹ lúc nào cho kịp?", "Gửi trước Tết khoảng 2 tuần để tránh dồn hàng cuối năm. Gọi để hỏi lịch chốt hàng.")],
        cta="Cần gửi hạt dưa đi Mỹ?",
    ),
    dict(
        slug="gui-tuong-chua-di-my", ten="tượng Chúa",
        title="Gửi tượng Chúa, tượng Đức Mẹ đi Mỹ, chống vỡ",
        desc="Gửi tượng Chúa, tượng Đức Mẹ, tượng thánh đi Mỹ cho gia đình, giáo xứ. Chèn xốp, đóng thùng nhiều lớp chống vỡ. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">tượng Chúa</span> đi Mỹ, đóng gói chống vỡ',
        lead="Tượng Chúa, tượng Đức Mẹ, tượng các thánh bằng composite, sứ, gỗ, đá – Minh Thiện chèn xốp từng phần, đóng thùng nhiều lớp và giao tận nhà, tận nhà thờ.",
        rows=[("Tượng composite, sứ, gỗ", "Nhận gửi"), ("Tượng lớn, tượng đá", "Nhận gửi")],
        h2="Tượng thánh tới nơi nguyên vẹn", sp="Mỗi tượng được quấn xốp, chèn kín khoảng trống và gia cố thùng trước khi gửi.",
        cards=[("Tượng Chúa", "Tượng Chúa Giêsu, Thánh Tâm, Chúa chịu nạn."),
               ("Tượng Đức Mẹ", "Đức Mẹ Maria, Đức Mẹ La Vang, Fatima."),
               ("Tượng các thánh", "Thánh Giuse, thánh Antôn và các thánh."),
               ("Đồ thờ gửi kèm", "Thánh giá, tràng hạt, khung ảnh gửi chung thùng.")],
        seller=dict(label="Dành cho giáo xứ và cộng đoàn", h2="Gửi tượng, đồ thờ cho nhà thờ bên Mỹ",
                    p="Đặt làm tượng ở xưởng Việt Nam, cho xưởng giao về kho. Minh Thiện kiểm, đóng thùng chống vỡ và giao tới nhà thờ.",
                    b=[("Nhận từ xưởng", "xưởng giao về kho, Minh Thiện kiểm hàng"), ("Chống vỡ", "quấn xốp, chèn kín, gia cố thùng"), ("Tượng lớn", "tư vấn đi đường thuỷ để đỡ cước")]),
        pill="Tượng / đồ thờ", note="Tượng nặng hoặc to tính theo số lớn hơn giữa cân thực và cân quy đổi – nhập kích thước để xem. Tượng lớn nên hỏi giá đường thuỷ. Giá trên là mức ước tính từ.",
        dims=True,
        img=(REAL + "kien-hang-carton.jpg", "Thùng hàng dán kín, ghi mã", "Thùng hàng dán kín, ghi mã từng kiện"),
        faqs=[("Tượng sứ, tượng composite có bị vỡ khi gửi không?", "Tượng được quấn nhiều lớp xốp, chèn kín mọi khoảng trống và đóng thùng chắc chắn. Có mua bảo hiểm thì đền 100% cước và giá trị hàng khai báo."),
              ("Tượng lớn gửi thế nào cho đỡ cước?", "Tượng to và nặng nên đi đường thuỷ, rẻ hơn đường bay nhiều. Gửi ảnh và kích thước qua Zalo để được báo giá cả hai đường."),
              ("Tượng gỗ gửi đi Mỹ được không?", "Được. Gỗ đã qua sơn, xử lý hoàn thiện thì đi bình thường. Gỗ mộc, còn vỏ thì gọi trước để nhân viên tư vấn.")],
        cta="Cần gửi tượng đi Mỹ?",
    ),
    dict(
        slug="gui-thanh-gia-di-my", ten="thánh giá",
        title="Gửi thánh giá, đồ thờ Công giáo đi Mỹ",
        desc="Gửi thánh giá, tràng hạt, đồ thờ Công giáo đi Mỹ cho gia đình, giáo xứ. Đóng gói chống trầy, chống gãy, giao tận nhà. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">thánh giá</span> đi Mỹ, đóng gói cẩn thận',
        lead="Thánh giá gỗ, đồng, đá, thánh giá treo tường, tràng hạt và đồ thờ Công giáo – Minh Thiện chèn kỹ, chống trầy, chống gãy và giao tận nhà hoặc nhà thờ.",
        rows=[("Thánh giá gỗ, đồng, đá", "Nhận gửi"), ("Tràng hạt, đồ thờ", "Nhận gửi")],
        h2="Đồ thờ Công giáo, gửi trọn vẹn", sp="Thánh giá to được gia cố khung, thánh giá nhỏ và tràng hạt đóng hộp riêng.",
        cards=[("Thánh giá treo tường", "Gỗ, đồng, composite – chèn góc chống gãy."),
               ("Thánh giá lớn", "Cho nhà thờ, nhà nguyện – tư vấn đường thuỷ."),
               ("Tràng hạt, mề đay", "Đóng hộp nhỏ, gửi chung thùng."),
               ("Tượng, khung ảnh", "Tượng thánh, ảnh thánh gửi kèm.")],
        seller=dict(label="Dành cho giáo xứ và cộng đoàn", h2="Gửi đồ thờ cho nhà thờ bên Mỹ",
                    p="Đặt làm thánh giá, tượng, đồ thờ ở xưởng Việt Nam. Minh Thiện nhận từ xưởng, đóng thùng cẩn thận và giao tới nhà thờ.",
                    b=[("Nhận từ xưởng", "xưởng giao về kho, Minh Thiện kiểm hàng"), ("Chống gãy", "gia cố khung, chèn góc"), ("Hàng lớn", "tư vấn đi đường thuỷ để đỡ cước")]),
        pill="Thánh giá / đồ thờ", note="Thánh giá to tính theo số lớn hơn giữa cân thực và cân quy đổi – nhập kích thước để xem. Giá trên là mức ước tính từ.",
        dims=True,
        img=(REAL + "kien-hang-carton.jpg", "Thùng hàng dán kín, ghi mã", "Thùng hàng dán kín, ghi mã từng kiện"),
        faqs=[("Thánh giá gỗ gửi đi Mỹ được không?", "Được. Gỗ đã sơn, xử lý hoàn thiện thì đi bình thường. Gỗ mộc, còn vỏ thì gọi trước để nhân viên tư vấn."),
              ("Thánh giá lớn cho nhà thờ gửi thế nào?", "Hàng to và nặng nên đi đường thuỷ để đỡ cước. Gửi ảnh và kích thước qua Zalo để được báo giá."),
              ("Có đóng gói chống gãy, chống trầy không?", "Có, miễn phí. Thánh giá được quấn xốp, chèn góc, gia cố khung và chụp ảnh lại trước khi gửi.")],
        cta="Cần gửi thánh giá đi Mỹ?",
    ),
    dict(
        slug="gui-den-led-di-my", ten="đèn LED",
        title="Gửi đèn LED đi Mỹ, đèn trang trí, đèn tiệm",
        desc="Gửi đèn LED, dây LED, đèn trang trí, đèn tiệm, đèn năng lượng mặt trời đi Mỹ. Đóng gói chống vỡ, giao tận nơi. Gọi 0977 064 246.",
        h1='Gửi <span style="color: #4FD6C3">đèn LED</span> đi Mỹ, đèn trang trí, đèn tiệm',
        lead="Dây LED, đèn âm trần, đèn trang trí, đèn năng lượng mặt trời, bảng LED – Minh Thiện nhận gửi và đóng gói chống vỡ, chống va đập.",
        rows=[("Đèn LED, dây LED", "Nhận gửi"), ("Đèn năng lượng mặt trời", "Nhận, có phụ thu")],
        h2="Đèn loại nào gửi được", sp="Đèn không kèm pin rời gửi bình thường. Đèn có pin thì nhân viên tư vấn trước.",
        cards=[("Dây LED, đèn trang trí", "Đèn Noel, đèn Tết, dây đèn trang trí tiệm."),
               ("Đèn tiệm, đèn âm trần", "Đèn LED, máng đèn, nguồn điện."),
               ("Đèn năng lượng mặt trời", "Đèn solar, tấm pin – có phụ thu mỗi kiện."),
               ("Bảng LED, chữ LED", "Bảng chạy chữ, chữ nổi gắn LED.")],
        pill="Đèn LED", note="Đèn không pin gửi bình thường. Đèn năng lượng mặt trời có phụ thu mỗi kiện; đèn có pin sạc gắn trong có rủi ro ở hải quan Mỹ. Không nhận pin rời. Giá trên là mức ước tính từ.",
        img=(REAL + "kien-hang-carton.jpg", "Thùng hàng dán kín, ghi mã", "Thùng hàng dán kín, ghi mã từng kiện"),
        faqs=[("Đèn LED gửi đi Mỹ được không?", "Được. Đèn LED, dây LED, đèn trang trí không kèm pin rời gửi bình thường."),
              ("Đèn có pin sạc gửi được không?", "Đèn có pin gắn trong vẫn đi được nhưng có rủi ro ở hải quan Mỹ. Đèn năng lượng mặt trời nhận gửi, có phụ thu mỗi kiện. Pin rời và sạc dự phòng thì không nhận."),
              ("Đèn có bị vỡ khi gửi không?", "Đèn được quấn chống sốc, giữ nguyên hộp và chèn chặt trong thùng. Có mua bảo hiểm thì đền 100% cước và giá trị hàng khai báo.")],
        cta="Cần gửi đèn LED đi Mỹ?",
    ),
]

CHECK = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8C6A2F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; margin-top: 2px"><path d="M20 6 9 17l-5-5"></path></svg>'


def esc(s):
    return s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")


def thay(html, cu, moi, so=1):
    n = html.count(cu)
    assert n == so, f"khuôn đổi rồi: tìm thấy {n} lần (cần {so}): {cu[:80]!r}"
    return html.replace(cu, moi)


def thay_khoi(html, mo, dong, moi):
    """Thay đoạn từ dấu `mo` tới hết dấu `dong` đầu tiên sau nó."""
    i = html.index(mo)
    j = html.index(dong, i) + len(dong)
    assert html.count(mo) == 1, f"dấu mở không duy nhất: {mo!r}"
    return html[:i] + moi + html[j:]


def the_mat_hang(t):
    cards = []
    for k, (ten, mota) in enumerate(t["cards"]):
        bg, fg = ICON_COLORS[k % 4]
        cards.append(f'''<div style="background: #FFFFFF; border: 1px solid #E2ECEA; border-radius: 18px; padding: 26px">
<div style="width: 52px; height: 52px; border-radius: 14px; background: {bg}; display: flex; align-items: center; justify-content: center"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="{fg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[k % 4]}</svg></div>
<h3 style="margin: 18px 0 8px; font-size: 20px; font-weight: 700">{esc(ten)}</h3>
<p style="margin: 0; color: #4F625F">{esc(mota)}</p>
</div>''')
    return f'''<!-- Mặt hàng -->
<section class="m-sec" style="max-width: 1180px; margin: 0 auto; padding: 80px 20px 40px">
<div style="max-width: 720px">
<div style="font-size: 14px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #0E7A6C">Gửi {esc(t["ten"])} đi Mỹ</div>
<h2 style="margin: 10px 0 12px; font-size: clamp(28px, 3.6vw, 40px); line-height: 1.2; font-weight: 800; letter-spacing: -0.015em">{esc(t["h2"])}</h2>
<p style="margin: 0; font-size: 17px; color: #4F625F">{esc(t["sp"])}</p>
</div>
<div style="margin-top: 36px; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px">
{chr(10).join(cards)}
</div>
</section>
'''


def khoi_seller(t):
    s = t.get("seller")
    if not s:
        return ""
    bullets = "\n".join(f'<div style="display: flex; gap: 12px; align-items: flex-start">{CHECK}<span><strong>{esc(a)}</strong> – {esc(b)}</span></div>' for a, b in s["b"])
    return f'''<!-- Seller -->
<section class="m-sec" style="max-width: 1180px; margin: 0 auto; padding: 40px 20px">
<div class="m-box" style="background: #F2EDE4; border: 1px solid #E3D8C6; border-radius: 24px; padding: 40px; display: flex; flex-wrap: wrap; gap: 40px; align-items: center">
<div style="flex: 999 1 420px; min-width: 0">
<div style="display: inline-block; padding: 6px 12px; border-radius: 8px; background: #FFFFFF; color: #7A4F12; font-size: 13px; font-weight: 700; letter-spacing: 0.02em">{esc(s["label"])}</div>
<h2 style="margin: 14px 0 12px; font-size: clamp(26px, 3.2vw, 36px); line-height: 1.2; font-weight: 800; letter-spacing: -0.015em">{esc(s["h2"])}</h2>
<p style="margin: 0 0 20px; font-size: 17px; color: #5A5245">{esc(s["p"])}</p>
<div style="display: flex; flex-direction: column; gap: 12px">
{bullets}
</div>
</div>
<div style="flex: 1 1 320px; min-width: 0">
<img class="m-img" loading="lazy" src="{IMG}{s.get("img", "ke-hang-fulfillment.jpg")}" alt="{esc(s.get("alt", "Kệ hàng tại kho Minh Thiện"))}" style="display: block; width: 100%; height: 380px; object-fit: cover; border-radius: 18px">
</div>
</div>
</section>
'''


def faq(q, a):
    return f'''<details style="background: #FFFFFF; border: 1px solid #E2ECEA; border-radius: 14px; padding: 0 22px">
<summary style="display: flex; justify-content: space-between; align-items: center; gap: 16px; min-height: 64px; font-weight: 700; font-size: 17px">{esc(q)}<span class="faq-plus" style="flex: none; font-size: 26px; font-weight: 400; color: #0E7A6C; transition: transform .2s">+</span></summary>
<p style="margin: 0 0 20px; color: #4F625F">{esc(a)}</p>
</details>
'''


def tao(khuon, t):
    h = khuon
    url = f"{SITE}/{t['slug']}"
    title = f"{t['title']} – Minh Thiện Logistics"
    old_title = "Vận chuyển hàng đi Mỹ 3–5 ngày, từ 79k/kg – Minh Thiện Logistics"
    old_desc = "Gửi hàng đi Mỹ bay nhanh 3–5 ngày, đường thuỷ từ 79k/kg. Nhận thuốc tây, thịt, trứng, sữa, yến, mỹ phẩm, hàng Amazon/Etsy/TikTok. Lấy hàng miễn phí TP.HCM. Gọi 0977 064 246."
    h = thay(h, old_title, esc(title), 2)
    h = thay(h, old_desc, esc(t["desc"]), 2)
    h = thay(h, f'href="{SITE}/van-chuyen-hang-di-my"', f'href="{url}"')
    h = thay(h, f'content="{SITE}/van-chuyen-hang-di-my"', f'content="{url}"')
    h = thay(h, f'content="{SITE}{IMG}hero-kho.jpg"', f'content="{SITE}{t["img"][0]}"')

    # Hero
    h = re.sub(r'<h1 [^>]*>.*?</h1>', lambda m: m.group(0)[:m.group(0).index(">") + 1] + t["h1"] + "</h1>", h, count=1, flags=re.S)
    h = thay(h, "<p style=\"margin: 0 0 28px; font-size: 19px; color: #C9DAD7; max-width: 560px\">Nhận gần như mọi mặt hàng – kể cả thuốc tây, thịt, trứng, sữa – và hàng bán trên Amazon, Etsy, TikTok Shop. Kho tại TP.HCM, điểm thu gom khắp cả nước.</p>",
             f'<p style="margin: 0 0 28px; font-size: 19px; color: #C9DAD7; max-width: 560px">{esc(t["lead"])}</p>')
    for (cu_nhan, _), (moi_nhan, moi_gt) in zip([("Thuốc tây, thịt, trứng, sữa", 0), ("Hàng Amazon / Etsy / TikTok", 0)], t["rows"]):
        h = thay(h, f'<span style="color: #4F625F">{cu_nhan}</span><strong style="color: #0E7A6C">Nhận gửi</strong>',
                 f'<span style="color: #4F625F">{esc(moi_nhan)}</span><strong style="color: #0E7A6C">{esc(moi_gt)}</strong>')

    # Ô số to đầu thẻ "Trả lời nhanh": thay "Hơn 70.000 đơn hàng" bằng đóng gói miễn phí
    h = thay(h, '<span style="font-size: 15px; font-weight: 600; color: #4F625F">Hơn</span><span style="font-size: 40px; line-height: 1; font-weight: 800; letter-spacing: -0.02em; color: #0E7A6C">70.000</span><span style="font-size: 17px; font-weight: 700">đơn hàng</span>',
             '<span style="font-size: 40px; line-height: 1; font-weight: 800; letter-spacing: -0.02em; color: #0E7A6C">Miễn phí</span><span style="font-size: 17px; font-weight: 700">đóng gói, thùng, hút chân không</span>')

    h = thay_khoi(h, "<!-- Mặt hàng -->", "</section>\n", the_mat_hang(t))
    h = thay_khoi(h, "<!-- Seller -->", "</section>\n", khoi_seller(t))

    # Ô tính giá: mặt hàng của trang là lựa chọn mặc định, kèm "hàng khác gửi chung"
    pills = (f'<button type="button" class="pill" data-type="mathang" aria-pressed="true">{esc(t["pill"])}</button>\n'
             '<button type="button" class="pill" data-type="thuong" aria-pressed="false">Hàng khác gửi kèm</button>\n')
    h = thay_khoi(h, '<button type="button" class="pill" data-type="thuong"', 'data-type="yen" aria-pressed="false">Yến / đông trùng</button>\n', pills)
    h = thay(h, "  var NOTES = {\n", "  var NOTES = {\n    mathang: " + json.dumps(t["note"], ensure_ascii=False) + ",\n")
    h = thay(h, "  var type = 'thuong';", "  var type = 'mathang';")
    if t.get("dims"):
        h = thay(h, '<button type="button" id="calc-dims-toggle" aria-expanded="false"', '<button type="button" id="calc-dims-toggle" aria-expanded="true"')
        h = thay(h, '<div id="calc-dims" hidden style=', '<div id="calc-dims" style=')
        h = thay(h, ">+ Thêm kích thước (hàng cồng kềnh)</button>", ">− Bỏ kích thước</button>")

    # Ảnh thật: ô đầu là ảnh đúng mặt hàng
    src, alt, cap = t["img"]
    h = thay(h, f'src="{IMG}yen-sao-dong-hop.jpg" alt="Yến sào đóng hộp tròn, xếp tại kho"', f'src="{src}" alt="{esc(alt)}"')
    h = thay(h, "<figcaption style=\"margin-top: 10px; font-weight: 600\">Yến sào đóng hộp, sẵn sàng gửi</figcaption>",
             f'<figcaption style="margin-top: 10px; font-weight: 600">{esc(cap)}</figcaption>')

    # FAQ: thay 2 câu đầu (thuốc, thịt) bằng câu riêng của mặt hàng
    mo = '<div style="display: flex; flex-direction: column; gap: 12px">\n<details'
    i = h.index(mo) + len('<div style="display: flex; flex-direction: column; gap: 12px">\n')
    j = h.rindex("<details", 0, h.index(FAQ_CHUNG_SAU))
    h = h[:i] + "".join(faq(q, a) for q, a in t["faqs"]) + h[j:]

    h = thay(h, ">Có hàng cần gửi đi Mỹ?</h2>", f">{esc(t['cta'])}</h2>")
    h = thay(h, '<a href="https://minhthienlogs.com">minhthienlogs.com</a></div>',
             '<a href="https://minhthienlogs.com">minhthienlogs.com</a> · <a href="/van-chuyen-hang-di-my">Gửi hàng đi Mỹ</a></div>')
    # Nhãn sự kiện ở /admin: phân biệt trang nào
    key = t["slug"].removeprefix("gui-").removesuffix("-di-my")
    h = thay(h, "label: 'landing-my:' + where", f"label: 'landing-my-{key}:' + where")
    return h


def main():
    khuon = KHUON.read_text(encoding="utf-8")
    slugs = []
    for t in T:
        if t.get("viet_tay"):
            slugs.append(t["slug"])
            print("bỏ qua (viết tay)", t["slug"])
            continue
        out = ROOT / "public" / t["slug"] / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(tao(khuon, t), encoding="utf-8")
        slugs.append(t["slug"])
        print("đã tạo", out.relative_to(ROOT))
    data = ROOT / "src/data/landing-mat-hang.json"
    data.write_text(json.dumps(slugs, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("đã ghi", data.relative_to(ROOT), len(slugs), "trang")


if __name__ == "__main__":
    main()
