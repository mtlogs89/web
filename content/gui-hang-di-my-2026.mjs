/**
 * Nội dung trang "Gửi hàng đi Mỹ" — bản marketing của khách (79K/kg, 3 ngày, bảo hiểm 100%).
 * Chuẩn SEO + AEO (FAQ JSON-LD). Nạp vào DB: node content/gui-hang-di-my-2026.mjs
 * Sửa nội dung sau khi nạp: /admin/bai-viet → tìm bài "Gửi hàng đi Mỹ".
 */
import Database from "better-sqlite3";
import { randomUUID } from "crypto";

const SLUG = "gui-hang-di-my-huong-dan-toan-tap";
const PHONE = "0589.77.89.89";
const BRAND = "Minh Thiện Logistics";

const img = (src, caption) =>
  `<figure><img src="${src}" alt="${caption}" loading="lazy" /><figcaption>${caption}</figcaption></figure>`;

const content = `
<p><strong>Bạn đang cần gửi hàng đi Mỹ nhanh chóng, tiết kiệm và an toàn?</strong> Bạn muốn gửi thuốc tây, thực phẩm, thịt heo, bò, gà hoặc những mặt hàng thường bị nhiều đơn vị vận chuyển từ chối? Dịch vụ của ${BRAND} mang đến giải pháp vận chuyển hàng từ Việt Nam sang Mỹ với mức giá cạnh tranh <strong>chỉ từ 79K/kg</strong>, thời gian nhận hàng nhanh <strong>từ 3 ngày</strong> và chính sách <strong>bảo hiểm hàng hóa lên đến 100%</strong> theo giá trị khai báo.</p>

${img("/images/my/gui-hang-di-my-hang-kho-bao-hiem.webp", "Gửi hàng đi Mỹ — nhận tất cả các loại hàng khó, bảo hiểm hàng hóa 100%")}

<p>Chúng tôi hỗ trợ khách hàng kiểm tra mặt hàng, chuẩn bị chứng từ, đóng gói đúng tiêu chuẩn và lựa chọn tuyến vận chuyển phù hợp. Quy trình được thiết kế rõ ràng, giúp hạn chế tối đa rủi ro chậm trễ, thất lạc hoặc phát sinh chi phí ngoài dự kiến.</p>

<p><strong>Lưu ý:</strong> Thuốc, thịt và thực phẩm là những nhóm hàng chịu sự kiểm soát nghiêm ngặt của cơ quan chức năng Hoa Kỳ. Dịch vụ chỉ tiếp nhận những sản phẩm đáp ứng quy định nhập khẩu, có nguồn gốc rõ ràng và chuẩn bị đầy đủ giấy tờ cần thiết. Khách hàng nên cung cấp thông tin chính xác để được kiểm tra trước khi gửi.</p>

<h2>Vì sao nhu cầu gửi hàng từ Việt Nam đi Mỹ ngày càng tăng?</h2>
<p>Mỹ là nơi sinh sống, học tập và làm việc của đông đảo người Việt. Vì vậy, nhu cầu gửi quà cho người thân, chuyển thực phẩm quê nhà, gửi đồ dùng cá nhân hoặc vận chuyển hàng kinh doanh sang Mỹ ngày càng phổ biến.</p>

${img("/images/my/gui-hang-di-my-nhan-da-dang-hang.webp", "Nhận gửi đa dạng các loại hàng đi Mỹ: quần áo, mỹ phẩm, thực phẩm khô, đồ gia dụng, hồ sơ")}

<p>Những mặt hàng thường được gửi từ Việt Nam đi Mỹ gồm:</p>
<ul>
  <li>Quần áo, giày dép và phụ kiện thời trang.</li>
  <li>Mỹ phẩm, sản phẩm chăm sóc cá nhân.</li>
  <li>Thực phẩm khô và đặc sản Việt Nam.</li>
  <li>Thuốc tây, thực phẩm chức năng và dược liệu.</li>
  <li>Thịt heo, bò, gà đã qua chế biến.</li>
  <li>Hồ sơ, giấy tờ và quà tặng.</li>
  <li>Hàng mẫu, linh kiện và đồ gia dụng.</li>
  <li>Hàng thương mại điện tử số lượng lớn.</li>
</ul>
<p>Tuy nhiên, không phải mặt hàng nào cũng có thể đóng thùng rồi gửi ngay. Đặc biệt, thuốc và thực phẩm có nguồn gốc động vật cần được kiểm tra kỹ về thành phần, nhãn mác, cách chế biến, bao bì và quy định nhập khẩu tại thời điểm gửi.</p>
<p>Lựa chọn một đơn vị có kinh nghiệm xử lý hàng khó sẽ giúp người gửi tiết kiệm thời gian, tránh đóng gói sai và giảm nguy cơ hàng bị giữ lại tại cửa khẩu.</p>

<h2>Dịch vụ gửi hàng đi Mỹ chỉ từ 79K/kg</h2>
<p>Chi phí luôn là yếu tố được khách hàng quan tâm hàng đầu. Tại ${BRAND}, cước gửi hàng đi Mỹ <strong>chỉ từ 79K/kg</strong>, áp dụng tùy theo loại hàng, tổng trọng lượng, kích thước kiện, địa chỉ nhận và chương trình ưu đãi tại từng thời điểm.</p>
<p>Mức giá thực tế có thể thay đổi dựa trên:</p>
<ul>
  <li>Trọng lượng cân thực tế của kiện hàng.</li>
  <li>Trọng lượng quy đổi theo kích thước.</li>
  <li>Nhóm hàng thông thường hoặc hàng cần xử lý đặc biệt.</li>
  <li>Tốc độ giao hàng khách hàng lựa chọn.</li>
  <li>Thành phố và tiểu bang nhận hàng tại Mỹ.</li>
  <li>Phụ phí đóng gói, kiểm dịch hoặc chứng từ nếu phát sinh.</li>
  <li>Thuế và phí nhập khẩu theo quy định của Hoa Kỳ.</li>
</ul>

${img("/images/real/can-kien-hang.jpg", "Cân và đo kích thước từng kiện để báo giá minh bạch trước khi gửi")}

<p>Trước khi tiếp nhận, nhân viên sẽ kiểm tra thông tin và báo giá cụ thể. Khách hàng được tư vấn phương án phù hợp với ngân sách, hạn chế tình trạng báo giá ban đầu thấp nhưng phát sinh nhiều khoản phí sau khi gửi.</p>
<p>Với các kiện hàng có trọng lượng lớn hoặc khách gửi thường xuyên, ${BRAND} có chính sách giá riêng dành cho đại lý, chủ shop và doanh nghiệp.</p>

<h2>Nhận vận chuyển nhiều loại hàng khó đi Mỹ</h2>
<p>Không chỉ nhận hàng hóa thông thường, chúng tôi còn hỗ trợ kiểm tra và vận chuyển nhiều nhóm hàng khó, bao gồm thuốc tây, thực phẩm và sản phẩm từ thịt heo, bò, gà.</p>

<h3>Gửi thuốc tây đi Mỹ</h3>
<p>Thuốc tây là mặt hàng được nhiều gia đình gửi cho người thân đang sinh sống tại Mỹ. Tuy nhiên, đây cũng là nhóm hàng bị kiểm soát chặt chẽ.</p>

${img("/images/real/thuoc-tay.jpg", "Thuốc tây gửi đi Mỹ cần nguyên hộp, nguyên nhãn và còn hạn sử dụng rõ ràng")}

<p>Tùy từng sản phẩm, khách hàng có thể cần cung cấp:</p>
<ul>
  <li>Tên thuốc và hình ảnh bao bì.</li>
  <li>Thành phần, hàm lượng và công dụng.</li>
  <li>Số lượng dự kiến gửi.</li>
  <li>Đơn thuốc hoặc chỉ định của bác sĩ nếu được yêu cầu.</li>
  <li>Hóa đơn, nguồn gốc sản phẩm.</li>
  <li>Thông tin người gửi và người nhận.</li>
  <li>Cam kết thuốc được gửi cho mục đích sử dụng phù hợp.</li>
</ul>
<p>Thuốc nên còn nguyên hộp, nguyên nhãn, có hạn sử dụng rõ ràng và không bị bóc tách khỏi bao bì thương mại. Một số loại thuốc kê đơn, thuốc có thành phần bị kiểm soát, sản phẩm không rõ nguồn gốc hoặc số lượng bất thường có thể không đủ điều kiện vận chuyển.</p>
<p>Nhân viên sẽ kiểm tra thông tin sơ bộ trước khi nhận. Việc kiểm tra này giúp khách hàng biết sản phẩm có phù hợp hay cần bổ sung chứng từ, nhưng không thay thế quyết định cuối cùng của hải quan và cơ quan quản lý tại Mỹ.</p>

<h3>Gửi thịt heo đi Mỹ</h3>
<p>Chúng tôi hỗ trợ tiếp nhận một số sản phẩm từ thịt heo đã được chế biến và đóng gói đúng tiêu chuẩn, tùy thuộc quy định có hiệu lực tại thời điểm gửi.</p>

${img("/images/real/kho-bo-ga.jpg", "Sản phẩm thịt đã qua chế biến: khô bò, khô gà, lạp xưởng — cần nhãn mác và bao bì kín")}

<p>Các sản phẩm khách hàng thường yêu cầu tư vấn gồm:</p>
<ul>
  <li>Chà bông heo.</li>
  <li>Khô heo.</li>
  <li>Lạp xưởng.</li>
  <li>Thịt heo sấy.</li>
  <li>Thực phẩm đóng hộp.</li>
  <li>Sản phẩm hút chân không có nhãn mác.</li>
</ul>
<p>Sản phẩm cần có nguồn gốc rõ ràng, thành phần đầy đủ, ngày sản xuất, hạn sử dụng và bao bì kín. Thịt tươi sống, sản phẩm tự chế biến không nhãn mác hoặc hàng không đáp ứng yêu cầu kiểm dịch có thể bị từ chối.</p>

<h3>Gửi thịt bò đi Mỹ</h3>
<p>Với thịt bò, điều kiện nhập khẩu có thể phụ thuộc vào nguồn gốc nguyên liệu, phương pháp chế biến, nhà sản xuất và tình hình kiểm dịch. Chúng tôi tiếp nhận thông tin sản phẩm trước khi xác nhận phương án vận chuyển.</p>
<p>Các mặt hàng có thể được xem xét gồm khô bò, bò sấy, thực phẩm đóng hộp hoặc sản phẩm đã qua chế biến công nghiệp. Khách hàng không nên tự đóng lẫn thực phẩm vào quần áo hoặc khai báo sai tên hàng. Việc khai báo trung thực giúp quá trình kiểm tra minh bạch và bảo vệ quyền lợi bảo hiểm.</p>

<h3>Gửi thịt gà đi Mỹ</h3>
<p>Các sản phẩm từ thịt gia cầm cũng thuộc nhóm hàng được kiểm soát. Một số loại chà bông gà, khô gà, gà đóng hộp hoặc thực phẩm chế biến sẵn có thể được kiểm tra để xác định điều kiện vận chuyển.</p>
<p>Sản phẩm nên có:</p>
<ul>
  <li>Nhãn hàng hóa rõ ràng.</li>
  <li>Danh sách thành phần.</li>
  <li>Cơ sở sản xuất.</li>
  <li>Ngày sản xuất và hạn sử dụng.</li>
  <li>Bao bì thương mại kín.</li>
  <li>Thông tin xuất xứ.</li>
</ul>
<p>Khả năng tiếp nhận không chỉ dựa trên việc sản phẩm đã được nấu chín hay hút chân không. Nhân viên cần kiểm tra từng mặt hàng trước khi đưa ra kết luận.</p>

<h2>Gửi hàng đi Mỹ nhanh từ 3 ngày</h2>
<p>Nếu cần gửi quà, hồ sơ hoặc hàng kinh doanh gấp, khách hàng có thể lựa chọn tuyến chuyển phát nhanh với thời gian giao dự kiến <strong>từ 3 ngày làm việc</strong>.</p>
<p>Thời gian cụ thể phụ thuộc vào:</p>
<ul>
  <li>Loại hàng hóa.</li>
  <li>Thời điểm đơn vị vận chuyển tiếp nhận kiện.</li>
  <li>Địa chỉ nhận tại Mỹ.</li>
  <li>Thời gian kiểm tra của hải quan.</li>
  <li>Chứng từ do khách hàng cung cấp.</li>
  <li>Điều kiện thời tiết và lịch khai thác chuyến bay.</li>
  <li>Các ngày nghỉ lễ tại Việt Nam hoặc Mỹ.</li>
</ul>
<p>Hàng thông thường, hồ sơ rõ ràng và địa chỉ thuộc khu vực trung tâm thường được xử lý nhanh hơn. Với thuốc, thực phẩm hoặc hàng cần kiểm dịch, thời gian có thể kéo dài nếu cơ quan chức năng yêu cầu kiểm tra hoặc bổ sung giấy tờ.</p>
<p>Vì vậy, “từ 3 ngày” là thời gian vận chuyển dự kiến trong điều kiện khai thác thuận lợi, không phải cam kết áp dụng cho mọi kiện hàng. Khách hàng sẽ được tư vấn tuyến phù hợp trước khi gửi.</p>

<h2>Bảo hiểm hàng hóa lên đến 100%</h2>
<p>Một trong những lo ngại lớn nhất khi vận chuyển quốc tế là hàng hóa bị thất lạc hoặc hư hỏng. Để khách hàng an tâm hơn, ${BRAND} cung cấp chính sách bảo hiểm hàng hóa <strong>lên đến 100% giá trị khai báo</strong> theo điều kiện của từng gói dịch vụ.</p>
<p>Để được bảo vệ quyền lợi, khách hàng cần:</p>
<ul>
  <li>Khai báo đúng loại hàng và số lượng.</li>
  <li>Cung cấp giá trị thực của sản phẩm.</li>
  <li>Xuất trình hóa đơn hoặc bằng chứng giá trị khi cần.</li>
  <li>Tuân thủ hướng dẫn đóng gói.</li>
  <li>Không gửi hàng cấm hoặc cố tình khai sai.</li>
  <li>Giữ lại biên nhận và mã vận đơn.</li>
</ul>
<p>Phạm vi bảo hiểm, mức khấu trừ, giới hạn bồi thường và các trường hợp loại trừ sẽ được thông báo trước khi gửi. Những rủi ro phát sinh do hàng hóa không đủ điều kiện nhập khẩu, khai báo sai, hư hỏng tự nhiên hoặc bao bì do khách tự đóng không đạt tiêu chuẩn có thể không thuộc phạm vi bảo hiểm.</p>

<h2>Quy trình gửi hàng từ Việt Nam sang Mỹ</h2>
<p>Quy trình gồm sáu bước đơn giản:</p>
<h3>Bước 1: Gửi thông tin hàng hóa</h3>
<p>Khách hàng cung cấp tên hàng, số lượng, trọng lượng dự kiến, hình ảnh sản phẩm, địa chỉ gửi và địa chỉ nhận. Với thuốc hoặc thực phẩm, cần gửi thêm ảnh thành phần và nhãn sản phẩm.</p>
<h3>Bước 2: Kiểm tra điều kiện vận chuyển</h3>
<p>Nhân viên phân loại mặt hàng, kiểm tra thông tin cơ bản và tư vấn giấy tờ cần chuẩn bị. Những sản phẩm không đủ điều kiện sẽ được thông báo trước khi đóng kiện.</p>
<h3>Bước 3: Báo giá minh bạch</h3>
<p>Cước phí được tính theo cân nặng, kích thước, loại hàng và thời gian giao dự kiến. Khách hàng xác nhận dịch vụ sau khi nhận báo giá.</p>
<h3>Bước 4: Nhận và đóng gói hàng</h3>
<p>Khách hàng có thể mang hàng đến điểm tiếp nhận hoặc đăng ký lấy hàng tại nhà ở khu vực được hỗ trợ. Kiện hàng được kiểm tra, gia cố và đóng gói theo đặc tính sản phẩm.</p>

${img("/images/real/dong-goi-giao-kien.jpg", "Kiện hàng được kiểm tra, gia cố và đóng gói theo đặc tính từng sản phẩm")}

<h3>Bước 5: Khai báo và vận chuyển</h3>
<p>Thông tin hàng hóa được khai báo theo chứng từ khách hàng cung cấp. Sau khi hoàn tất thủ tục cần thiết, kiện hàng được đưa lên tuyến vận chuyển sang Mỹ.</p>
<h3>Bước 6: Theo dõi và giao tận nơi</h3>
<p>Mỗi kiện hàng có mã vận đơn để theo dõi hành trình. Người nhận được giao hàng tại địa chỉ đã đăng ký, tùy điều kiện phát hàng tại khu vực đích. Bạn nhập mã vận đơn tại <a href="/tra-cuu">trang tra cứu đơn hàng</a> để xem hành trình bất cứ lúc nào.</p>

<h2>Cách đóng gói hàng gửi đi Mỹ an toàn</h2>
<p>Đóng gói đúng cách giúp hạn chế móp méo, đổ vỡ và ảnh hưởng đến chất lượng sản phẩm.</p>
<p><strong>Đối với thuốc tây</strong>, nên giữ nguyên bao bì, chèn chống sốc và bọc kín để tránh ẩm. Không nên tháo thuốc khỏi vỉ hoặc gom nhiều loại thuốc vào một túi không có nhãn.</p>
<p><strong>Đối với thực phẩm khô</strong>, sản phẩm cần được đóng kín, ưu tiên bao bì của nhà sản xuất. Nếu phù hợp với quy định của mặt hàng, có thể hút chân không và bọc thêm lớp chống rò rỉ.</p>
<p><strong>Đối với chai lọ</strong>, nên dán kín nắp, bọc từng sản phẩm bằng vật liệu chống sốc và đặt trong túi chống tràn. Không để khoảng trống quá lớn trong thùng.</p>
<p><strong>Đối với quần áo và đồ dùng cá nhân</strong>, có thể dùng túi nén để giảm thể tích. Tuy nhiên, khách hàng không nên giấu thuốc hoặc thực phẩm bên trong quần áo nhằm né kiểm tra.</p>

${img("/images/real/thung-hang-san-sang.jpg", "Những kiện hàng đã đóng gói chuẩn, sẵn sàng rời kho đi Mỹ")}

<h2>Những mặt hàng không nhận gửi đi Mỹ</h2>
<p>Danh sách hàng cấm và hạn chế có thể thay đổi theo quy định. Một số nhóm hàng thường không được tiếp nhận gồm:</p>
<ul>
  <li>Ma túy, chất kích thích và thuốc thuộc danh mục cấm.</li>
  <li>Vũ khí, đạn dược hoặc vật liệu nguy hiểm.</li>
  <li>Chất cháy nổ và hóa chất không xác định.</li>
  <li>Tiền mặt, giấy tờ có giá hoặc hàng giả.</li>
  <li>Động vật sống và sản phẩm từ động vật hoang dã bị cấm.</li>
  <li>Thực phẩm không rõ nguồn gốc hoặc có dấu hiệu hư hỏng.</li>
  <li>Thuốc không nhãn mác, hết hạn hoặc không xác định thành phần.</li>
  <li>Hàng vi phạm quyền sở hữu trí tuệ.</li>
  <li>Sản phẩm bị cấm nhập khẩu theo quy định hiện hành.</li>
</ul>
<p>Khách hàng nên gửi hình ảnh trước để được kiểm tra, đặc biệt với mặt hàng khó.</p>

<h2>Câu hỏi thường gặp về gửi hàng đi Mỹ</h2>
<h3>Gửi hàng đi Mỹ giá bao nhiêu một kg?</h3>
<p>Cước phí chỉ từ 79K/kg, tùy tổng trọng lượng, kích thước, địa chỉ nhận, loại hàng và thời gian giao. Giá chính xác được báo sau khi có thông tin kiện hàng.</p>
<h3>Gửi hàng từ Việt Nam sang Mỹ mất bao lâu?</h3>
<p>Tuyến nhanh có thời gian dự kiến từ 3 ngày làm việc. Hàng cần kiểm tra chuyên ngành hoặc bổ sung chứng từ có thể mất nhiều thời gian hơn.</p>
<h3>Có nhận gửi thuốc tây đi Mỹ không?</h3>
<p>Có hỗ trợ kiểm tra và tiếp nhận thuốc đủ điều kiện. Thuốc cần nguyên nhãn, rõ thành phần, còn hạn sử dụng và có chứng từ phù hợp nếu được yêu cầu.</p>
<h3>Có gửi được thịt heo, bò, gà sang Mỹ không?</h3>
<p>Một số sản phẩm đã qua chế biến, đóng gói đúng chuẩn và đáp ứng quy định có thể được tiếp nhận. Cần gửi hình ảnh nhãn, thành phần và nguồn gốc để kiểm tra trước.</p>
<h3>Hàng thất lạc có được bồi thường không?</h3>
<p>Kiện hàng có thể được bảo hiểm lên đến 100% giá trị khai báo nếu đáp ứng đầy đủ điều kiện của chính sách bảo hiểm. Mức bồi thường cụ thể căn cứ vào chứng từ và điều khoản đã xác nhận.</p>
<h3>Có lấy hàng tận nhà không?</h3>
<p>Dịch vụ hỗ trợ lấy hàng tại nhà ở các khu vực đang phục vụ. Khách hàng cần cung cấp địa chỉ và thời gian thuận tiện để được sắp xếp.</p>
<h3>Có giao hàng tận nơi tại Mỹ không?</h3>
<p>Có. Hàng được giao đến địa chỉ người nhận tại Mỹ theo phạm vi phục vụ của tuyến vận chuyển. Một số khu vực xa hoặc đặc biệt có thể phát sinh thêm thời gian và phụ phí.</p>

<h2>Liên hệ gửi hàng đi Mỹ ngay hôm nay</h2>
<p>Với lợi thế giá chỉ từ 79K/kg, thời gian giao dự kiến nhanh từ 3 ngày, hỗ trợ kiểm tra nhiều mặt hàng khó và bảo hiểm hàng hóa lên đến 100%, ${BRAND} là lựa chọn phù hợp cho cá nhân, gia đình, chủ shop và doanh nghiệp có nhu cầu gửi hàng từ Việt Nam sang Mỹ.</p>
<p>Để nhận báo giá, khách hàng chỉ cần gửi:</p>
<ul>
  <li>Hình ảnh và tên hàng.</li>
  <li>Trọng lượng dự kiến.</li>
  <li>Kích thước kiện hàng nếu có.</li>
  <li>Địa chỉ gửi tại Việt Nam.</li>
  <li>Thành phố, tiểu bang và mã ZIP tại Mỹ.</li>
  <li>Thời gian mong muốn nhận hàng.</li>
</ul>
<p><strong>Hotline / Zalo:</strong> ${PHONE} — Ms. Min<br />
<strong>Địa chỉ:</strong> 5/5 Nguyễn Văn Vĩnh, Phường Tân Sơn Nhất, TP. Hồ Chí Minh<br />
<strong>Thời gian làm việc:</strong> 24/7</p>
`.trim();

const faqs = [
  {
    q: "Gửi hàng đi Mỹ giá bao nhiêu một kg?",
    a: "Cước phí chỉ từ 79K/kg, tùy tổng trọng lượng, kích thước, địa chỉ nhận, loại hàng và thời gian giao. Giá chính xác được báo sau khi có thông tin kiện hàng.",
  },
  {
    q: "Gửi hàng từ Việt Nam sang Mỹ mất bao lâu?",
    a: "Tuyến nhanh có thời gian dự kiến từ 3 ngày làm việc. Hàng cần kiểm tra chuyên ngành hoặc bổ sung chứng từ có thể mất nhiều thời gian hơn.",
  },
  {
    q: "Có nhận gửi thuốc tây đi Mỹ không?",
    a: "Có hỗ trợ kiểm tra và tiếp nhận thuốc đủ điều kiện. Thuốc cần nguyên nhãn, rõ thành phần, còn hạn sử dụng và có chứng từ phù hợp nếu được yêu cầu.",
  },
  {
    q: "Có gửi được thịt heo, bò, gà sang Mỹ không?",
    a: "Một số sản phẩm đã qua chế biến, đóng gói đúng chuẩn và đáp ứng quy định có thể được tiếp nhận. Cần gửi hình ảnh nhãn, thành phần và nguồn gốc để kiểm tra trước.",
  },
  {
    q: "Hàng thất lạc có được bồi thường không?",
    a: "Kiện hàng có thể được bảo hiểm lên đến 100% giá trị khai báo nếu đáp ứng đầy đủ điều kiện của chính sách bảo hiểm. Mức bồi thường cụ thể căn cứ vào chứng từ và điều khoản đã xác nhận.",
  },
  {
    q: "Có lấy hàng tận nhà không?",
    a: "Dịch vụ hỗ trợ lấy hàng tại nhà ở các khu vực đang phục vụ. Khách hàng cần cung cấp địa chỉ và thời gian thuận tiện để được sắp xếp.",
  },
  {
    q: "Có giao hàng tận nơi tại Mỹ không?",
    a: "Có. Hàng được giao đến địa chỉ người nhận tại Mỹ theo phạm vi phục vụ của tuyến vận chuyển. Một số khu vực xa hoặc đặc biệt có thể phát sinh thêm thời gian và phụ phí.",
  },
];

const now = new Date().toISOString();
const db = new Database(new URL("../prisma/dev.db", import.meta.url).pathname);
const existing = db.prepare("SELECT id FROM Article WHERE slug = ?").get(SLUG);

const data = {
  slug: SLUG,
  title: "Gửi hàng đi Mỹ giá chỉ từ 79K/kg, nhận cả hàng khó, bảo hiểm hàng hóa 100%",
  excerpt:
    "Gửi hàng đi Mỹ chỉ từ 79K/kg, nhận hàng nhanh từ 3 ngày, bảo hiểm hàng hóa lên đến 100% giá trị khai báo. Nhận cả hàng khó: thuốc tây, thực phẩm, thịt heo, bò, gà đã qua chế biến. Lấy hàng tận nhà, giao tận nơi tại Mỹ.",
  content,
  coverImage: "/images/my/gui-hang-di-my-hang-kho-bao-hiem.webp",
  category: "Mỹ",
  tags: "gửi hàng đi Mỹ,gửi thuốc tây đi Mỹ,gửi thịt heo đi Mỹ,gửi thịt bò đi Mỹ,gửi thịt gà đi Mỹ,cước gửi hàng đi Mỹ,bảo hiểm hàng hóa",
  // KHÔNG thêm "| Minh Thiện Logistics" — layout tự nối tên brand vào sau (template "%s | site.name").
  metaTitle: "Gửi hàng đi Mỹ từ 79K/kg — nhận hàng khó, bảo hiểm 100%",
  metaDescription:
    "Gửi hàng đi Mỹ chỉ từ 79K/kg, nhanh từ 3 ngày, bảo hiểm hàng hóa lên đến 100%. Nhận thuốc tây, thực phẩm, thịt heo bò gà đã chế biến. Lấy hàng tận nhà. Zalo 0589.77.89.89 - Ms. Min.",
  faqJson: JSON.stringify(faqs),
  published: 1,
};

if (existing) {
  db.prepare(
    `UPDATE Article SET title=@title, excerpt=@excerpt, content=@content, coverImage=@coverImage,
     category=@category, tags=@tags, metaTitle=@metaTitle, metaDescription=@metaDescription,
     faqJson=@faqJson, published=@published, updatedAt=@updatedAt WHERE slug=@slug`
  ).run({ ...data, updatedAt: now });
  console.log("Đã CẬP NHẬT bài:", SLUG);
} else {
  db.prepare(
    `INSERT INTO Article (id, slug, title, excerpt, content, coverImage, category, tags,
     metaTitle, metaDescription, faqJson, published, views, publishedAt, createdAt, updatedAt)
     VALUES (@id, @slug, @title, @excerpt, @content, @coverImage, @category, @tags,
     @metaTitle, @metaDescription, @faqJson, @published, 0, @now, @now, @now)`
  ).run({ ...data, id: "a" + randomUUID(), now, updatedAt: now });
  console.log("Đã TẠO bài mới:", SLUG);
}

const words = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
console.log("Số chữ:", words, "| FAQ (AEO JSON-LD):", faqs.length, "| Ảnh:", (content.match(/<figure>/g) || []).length);
