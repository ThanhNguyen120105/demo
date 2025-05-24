import { 
  faVirus, faPills, faShieldVirus, faUserDoctor, 
  faHeartbeat, faUsers, faFlask, faHandHoldingMedical 
} from '@fortawesome/free-solid-svg-icons';

// Stats 
export const stats = [
  { value: '20+', label: 'Năm Kinh Nghiệm' },
  { value: '15,000+', label: 'Bệnh Nhân Đã Điều Trị' },
  { value: '30+', label: 'Bác Sĩ Chuyên Khoa' },
  { value: '98%', label: 'Tỷ Lệ Điều Trị Thành Công' },
];

// Services
export const services = [
  {
    id: 1,
    title: 'Xét Nghiệm & Sàng Lọc HIV',
    slug: 'testing',
    icon: faVirus,
    description: 'Dịch vụ xét nghiệm HIV tiên tiến với kết quả nhanh chóng và bảo mật hoàn toàn.',
    fullDescription: "Dịch vụ Xét Nghiệm & Sàng Lọc HIV của chúng tôi cung cấp công nghệ chẩn đoán tiên tiến nhất, mang đến kết quả chính xác với sự bảo mật tuyệt đối. Chúng tôi cung cấp nhiều lựa chọn xét nghiệm bao gồm:\n\n• Xét nghiệm kháng thể HIV nhanh\n• Xét nghiệm axit nucleic (NAT)\n• Xét nghiệm kết hợp kháng nguyên/kháng thể\n• Bộ xét nghiệm tại nhà\n\nĐội ngũ nhân viên giàu kinh nghiệm của chúng tôi cung cấp tư vấn trước và sau xét nghiệm, đảm bảo bạn hiểu rõ kết quả và các bước tiếp theo.",
    image: '/images/services/testing.jpg'
  },
  {
    id: 2,
    title: 'Liệu Pháp Kháng Retrovirus',
    slug: 'treatment',
    icon: faPills,
    description: 'Kế hoạch điều trị cá nhân hóa sử dụng các loại thuốc kháng retrovirus và liệu pháp mới nhất.',
    fullDescription: "Chương trình Liệu Pháp Kháng Retrovirus (ART) của chúng tôi cung cấp kế hoạch điều trị cá nhân hóa sử dụng các loại thuốc và phương pháp điều trị tiên tiến nhất. Chăm sóc toàn diện của chúng tôi bao gồm:\n\n• Phác đồ thuốc được điều chỉnh riêng cho từng người\n• Theo dõi và điều chỉnh thường xuyên\n• Hỗ trợ tuân thủ dùng thuốc\n• Quản lý tác dụng phụ của thuốc\n• Tiếp cận với các thử nghiệm lâm sàng về liệu pháp mới\n\nMục tiêu của chúng tôi là đạt được sự ức chế virus, cải thiện chức năng miễn dịch và nâng cao chất lượng cuộc sống tổng thể của bạn.",
    image: '/images/services/treatment.jpg'
  },
  {
    id: 3,
    title: 'PrEP & Phòng Ngừa',
    slug: 'prevention',
    icon: faShieldVirus,
    description: 'Dự phòng trước phơi nhiễm (PrEP) và các chiến lược phòng ngừa toàn diện và giáo dục.',
    fullDescription: "Dịch vụ Phòng Ngừa của chúng tôi tập trung vào giảm lây truyền HIV thông qua giáo dục toàn diện và can thiệp y tế. Chúng tôi cung cấp:\n\n• Kê đơn và theo dõi dự phòng trước phơi nhiễm (PrEP)\n• Dự phòng sau phơi nhiễm (PEP) cho các trường hợp khẩn cấp\n• Tư vấn giảm thiểu rủi ro\n• Giáo dục và nguồn lực về tình dục an toàn\n• Sàng lọc và điều trị STI thường xuyên\n\nCác chuyên gia phòng ngừa của chúng tôi sẽ làm việc với bạn để phát triển các chiến lược phù hợp với lối sống và nhu cầu của bạn.",
    image: '/images/services/prevention.jpg'
  },
  {
    id: 4,
    title: 'Dịch Vụ Tư Vấn',
    slug: 'counseling',
    icon: faUserDoctor,
    description: 'Hỗ trợ sức khỏe tâm thần chuyên nghiệp chuyên về các thách thức tâm lý liên quan đến HIV.',
    fullDescription: "Dịch Vụ Tư Vấn của chúng tôi giải quyết các khía cạnh cảm xúc và tâm lý của việc sống chung với HIV. Các chuyên gia sức khỏe tâm thần có giấy phép của chúng tôi chuyên về:\n\n• Đối phó với chẩn đoán\n• Quản lý lo âu và trầm cảm\n• Tư vấn về mối quan hệ và tiết lộ tình trạng\n• Rối loạn sử dụng chất gây nghiện\n• Chăm sóc có hiểu biết về sang chấn\n\nChúng tôi cung cấp các buổi tư vấn cá nhân, cặp đôi và nhóm trong môi trường hỗ trợ, bảo mật.",
    image: '/images/services/counseling.jpg'
  },
  {
    id: 5,
    title: 'Dinh Dưỡng & Sức Khỏe',
    slug: 'nutrition',
    icon: faHeartbeat,
    description: 'Kế hoạch dinh dưỡng chuyên biệt và các chương trình sức khỏe để hỗ trợ sức khỏe tổng thể khi sống với HIV.',
    fullDescription: "Các chương trình Dinh Dưỡng & Sức Khỏe của chúng tôi cung cấp hỗ trợ toàn diện cho sức khỏe thể chất của bạn. Các chuyên gia dinh dưỡng và sức khỏe của chúng tôi cung cấp:\n\n• Lập kế hoạch dinh dưỡng cá nhân hóa\n• Hướng dẫn về thực phẩm bổ sung\n• Quản lý tương tác giữa thuốc và thực phẩm\n• Hỗ trợ kiểm soát cân nặng\n• Các chương trình tập luyện và thể dục\n\nCách tiếp cận toàn diện của chúng tôi đảm bảo cơ thể bạn được hỗ trợ tối ưu cho chức năng miễn dịch và sức khỏe tổng thể.",
    image: '/images/services/nutrition.jpg'
  },
  {
    id: 6,
    title: 'Nhóm Hỗ Trợ',
    slug: 'support',
    icon: faUsers,
    description: 'Hỗ trợ đồng đẳng và kết nối cộng đồng cho các cá nhân sống chung với hoặc bị ảnh hưởng bởi HIV.',
    fullDescription: "Các Nhóm Hỗ Trợ của chúng tôi cung cấp kết nối cộng đồng thiết yếu và hỗ trợ đồng đẳng. Chúng tôi cung cấp nhiều nhóm khác nhau bao gồm:\n\n• Những người mới được chẩn đoán\n• Những người sống sót lâu dài\n• Thanh niên sống chung với HIV\n• Nhóm hỗ trợ phụ nữ\n• Nhóm tập trung LGBTQ+\n• Hỗ trợ gia đình và bạn đời\n\nTất cả các nhóm đều được hướng dẫn bởi các chuyên gia được đào tạo trong môi trường an toàn, bảo mật nơi mọi người có thể chia sẻ kinh nghiệm.",
    image: '/images/services/support.jpg'
  },
  {
    id: 7,
    title: 'Chương Trình Nghiên Cứu',
    slug: 'research',
    icon: faFlask,
    description: 'Cơ hội tham gia vào các nghiên cứu điều trị và phòng ngừa HIV tiên tiến.',
    fullDescription: "Chương Trình Nghiên Cứu của chúng tôi kết nối bệnh nhân với cơ hội tham gia vào các nghiên cứu tiên tiến. Các sáng kiến nghiên cứu của chúng tôi bao gồm:\n\n• Thử nghiệm lâm sàng cho các loại thuốc mới\n• Nghiên cứu tối ưu hóa điều trị\n• Nghiên cứu kết quả dài hạn\n• Nghiên cứu cải thiện chất lượng cuộc sống\n• Thử nghiệm phát triển vắc-xin\n\nViệc tham gia luôn là tự nguyện, và đội ngũ nghiên cứu của chúng tôi đảm bảo bạn được thông tin đầy đủ về bất kỳ nghiên cứu nào trước khi đăng ký.",
    image: '/images/services/research.jpg'
  },
  {
    id: 8,
    title: 'Quản Lý Trường Hợp',
    slug: 'case-management',
    icon: faHandHoldingMedical,
    description: 'Hỗ trợ toàn diện về điều phối chăm sóc sức khỏe, dịch vụ xã hội và hỗ trợ thực tế.',
    fullDescription: "Dịch vụ Quản Lý Trường Hợp của chúng tôi giúp điều hướng hệ thống chăm sóc sức khỏe và hỗ trợ phức tạp. Nhân viên quản lý trường hợp của chúng tôi hỗ trợ với:\n\n• Điều phối chăm sóc sức khỏe\n• Hướng dẫn bảo hiểm và phúc lợi\n• Hỗ trợ nhà ở\n• Nguồn lực việc làm\n• Dịch vụ vận chuyển\n• Giới thiệu pháp lý\n\nNhân viên quản lý trường hợp chuyên trách của bạn hoạt động như người bảo vệ quyền lợi, đảm bảo bạn có quyền tiếp cận với tất cả các nguồn lực và hỗ trợ cần thiết.",
    image: '/images/services/case-management.jpg'
  }
];

// Doctors/Specialists
export const doctors = [
  {
    id: 1,
    name: 'Bác Sĩ NGUYỄN VĂN AN',
    specialty: 'Giám đốc Trung tâm Tim mạch',
    image: '/images/doctors/doctor1.jpg',
    shortBio: 'Chuyên gia có chứng nhận với hơn 15 năm kinh nghiệm điều trị HIV.',
    fullBio: "Bác Sĩ  NGUYỄN VĂN AN là Chuyên Gia Bệnh Truyền Nhiễm có chứng nhận với hơn 15 năm kinh nghiệm trong y học HIV. Bà tốt nghiệp y khoa tại Đại học Johns Hopkins, sau đó hoàn thành chương trình nội trú về Y khoa Nội khoa và học bổng về Bệnh Truyền Nhiễm tại UCSF.\n\nBác Sĩ Johnson đã xuất bản nhiều công trình về tối ưu hóa liệu pháp kháng retrovirus và được công nhận về phương pháp chăm sóc lấy bệnh nhân làm trung tâm. Bà đảm nhiệm vị trí Giám đốc Chương trình Liệu pháp Kháng Retrovirus và tích cực tham gia vào nghiên cứu lâm sàng.",
    education: [
      'Bác sĩ Y khoa, Trường Y Johns Hopkins University',
      'Nội trú về Y khoa Nội khoa, UCSF',
      'Học bổng về Bệnh Truyền Nhiễm, UCSF'
    ],
    certifications: [
      'Chứng nhận về Bệnh Truyền Nhiễm',
      'Chuyên gia của Học viện Y học HIV Hoa Kỳ',
      'Nhà Cung cấp được Chứng nhận của Hiệp hội Y học HIV'
    ]
  },
  {
    id: 2,
    name: 'Bác Sĩ TRẦN THỊ MINH',
    specialty: 'Dược sĩ Lâm sàng HIV',
    image: '/images/doctors/doctor2.jpg',
    shortBio: 'Dược sĩ chuyên khoa tập trung vào quản lý thuốc và hỗ trợ tuân thủ.',
    fullBio: "Bác Sĩ TRẦN THỊ MINH là Dược sĩ Lâm sàng HIV của chúng tôi với đào tạo chuyên biệt về quản lý thuốc kháng retrovirus. Ông có bằng Tiến sĩ Dược từ Đại học Michigan và hoàn thành chương trình nội trú chuyên khoa về Dược lý HIV tại Bệnh viện Northwestern Memorial.\n\nBác Sĩ Chen làm việc chặt chẽ với đội ngũ y tế của chúng tôi để tối ưu hóa phác đồ thuốc, quản lý tương tác thuốc và phát triển chiến lược tuân thủ. Ông cũng dẫn dắt các chương trình giáo dục về thuốc và nhóm hỗ trợ cho bệnh nhân bắt đầu điều trị mới.",
    education: [
      'Tiến sĩ Dược, Trường Đại học Dược Michigan',
      'Nội trú về Dược lý HIV, Bệnh viện Northwestern Memorial'
    ],
    certifications: [
      'Chứng nhận Dược sĩ Bệnh Truyền Nhiễm',
      'Dược sĩ có Chứng chỉ của Học viện Y học HIV Hoa Kỳ',
      'Chứng nhận về Quản lý Liệu pháp Thuốc HIV'
    ]
  },
  {
    id: 3,
    name: 'Bác sĩ LÊ VĂN PHÚC',
    specialty: 'Bác sĩ Chăm sóc chính HIV',
    image: '/images/doctors/doctor3.jpg',
    shortBio: 'Chăm sóc chính toàn diện với chuyên môn về HIV và sức khỏe phòng ngừa.',
    fullBio: "Bác Sĩ Amara Okafor là Bác Sĩ Chăm Sóc Chính HIV của chúng tôi, cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho bệnh nhân sống chung với HIV. Bà nhận bằng y khoa từ Trường Y Howard University và hoàn thành chương trình nội trú về Y học Gia đình tại Đại học Emory.\n\nBác Sĩ Okafor chuyên về quản lý nhu cầu chăm sóc sức khỏe chính của người sống chung với HIV, bao gồm chăm sóc phòng ngừa, quản lý bệnh mãn tính và duy trì sức khỏe. Bà nổi tiếng về cách tiếp cận toàn diện đối với chăm sóc bệnh nhân và nhấn mạnh mạnh mẽ vào việc giáo dục bệnh nhân.",
    education: [
      'Bác sĩ Y khoa, Trường Y Howard University',
      'Nội trú về Y học Gia đình, Đại học Emory',
      'Học bổng Y học HIV, Hệ thống Y tế Grady'
    ],
    certifications: [
      'Chứng nhận về Y học Gia đình',
      'Chuyên gia của Học viện Y học HIV Hoa Kỳ',
      'Chứng nhận về Chăm sóc Chính HIV'
    ]
  },
  {
    id: 4,
    name: 'Bác Sĩ NGUYỄN THỊ HÀ',
    specialty: 'Bác Sĩ Tâm thần, Sức khỏe Tâm thần HIV',
    image: '/images/doctors/doctor4.jpg',
    shortBio: 'Chuyên gia sức khỏe tâm thần với chuyên môn về các thách thức tâm lý liên quan đến HIV.',
    fullBio: "Bác Sĩ NGUYỄN THỊ HÀ là Bác Sĩ Tâm thần Sức khỏe Tâm thần HIV của chúng tôi với chuyên môn đặc biệt về các khía cạnh tâm lý của việc sống chung với HIV. Ông nhận bằng y khoa từ Trường Y Stanford University và hoàn thành chương trình nội trú tâm thần tại UCLA.\n\nBác Sĩ Garcia chuyên điều trị trầm cảm, lo âu, sang chấn và các rối loạn thích ứng trong bối cảnh chẩn đoán và điều trị HIV. Ông kết hợp quản lý thuốc với các phương pháp tâm lý trị liệu để cung cấp dịch vụ chăm sóc sức khỏe tâm thần toàn diện.",
    education: [
      'Bác sĩ Y khoa, Trường Y Stanford University',
      'Nội trú Tâm thần, Trung tâm Y tế UCLA',
      'Học bổng về Tâm thần HIV, Bệnh viện Đa khoa San Francisco'
    ],
    certifications: [
      'Chứng nhận về Tâm thần học',
      'Chứng nhận về Tâm thần HIV',
      'Thành viên của Học viện Y học HIV Hoa Kỳ'
    ]
  },
  {
    id: 5,
    name: 'Bác Sĩ Lisa Wong',
    specialty: 'Giám đốc Nghiên cứu, Nghiên cứu Vắc-xin HIV',
    image: '/images/doctors/doctor5.jpg',
    shortBio: 'Nhà nghiên cứu hàng đầu về phát triển vắc-xin HIV và các phương pháp liệu pháp miễn dịch.',
    fullBio: "Bác Sĩ Lisa Wong là Giám đốc Nghiên cứu chuyên về phát triển vắc-xin HIV và các phương pháp liệu pháp miễn dịch. Bà có bằng Bác sĩ Y khoa và Tiến sĩ từ Đại học Yale và hoàn thành học bổng về Bệnh Truyền Nhiễm tại Bệnh viện Massachusetts General.\n\nBác Sĩ Wong dẫn dắt bộ phận nghiên cứu lâm sàng của chúng tôi, giám sát các thử nghiệm về thuốc kháng retrovirus mới, chiến lược điều trị và vắc-xin phòng ngừa. Nghiên cứu của bà tập trung vào các phương pháp liệu pháp miễn dịch mới để điều trị HIV và các chiến lược chữa bệnh tiềm năng.",
    education: [
      'Bác sĩ Y khoa/Tiến sĩ, Đại học Yale',
      'Nội trú về Y khoa Nội khoa, Bệnh viện Brigham and Women\'s',
      'Học bổng về Bệnh Truyền Nhiễm, Bệnh viện Massachusetts General'
    ],
    certifications: [
      'Chứng nhận về Bệnh Truyền Nhiễm',
      'Chứng nhận Nghiên cứu Lâm sàng',
      'Chứng nhận Thực hành Lâm sàng Tốt'
    ]
  },
  {
    id: 6,
    name: 'Bác Sĩ James Wilson',
    specialty: 'Chuyên gia Dinh dưỡng, Chăm sóc Chuyển hóa HIV',
    image: '/images/doctors/doctor6.jpg',
    shortBio: 'Chuyên gia dinh dưỡng chuyên về các biến chứng chuyển hóa của HIV và các phương pháp điều trị.',
    fullBio: "Bác Sĩ James Wilson là Chuyên gia Dinh dưỡng Chăm sóc Chuyển hóa HIV của chúng tôi, chuyên về các khía cạnh dinh dưỡng và chuyển hóa của HIV và các phương pháp điều trị. Ông có bằng Tiến sĩ Khoa học Dinh dưỡng từ Đại học Cornell và hoàn thành đào tạo chuyên biệt về dinh dưỡng HIV.\n\nBác Sĩ Wilson giúp bệnh nhân quản lý các thay đổi chuyển hóa liên quan đến thuốc, phát triển kế hoạch dinh dưỡng tối ưu và giải quyết các vấn đề về quản lý cân nặng. Ông làm việc chặt chẽ với đội ngũ y tế của chúng tôi để tích hợp chăm sóc dinh dưỡng vào kế hoạch điều trị tổng thể.",
    education: [
      'Tiến sĩ Khoa học Dinh dưỡng, Đại học Cornell',
      'Thạc sĩ Dinh dưỡng học, Đại học North Carolina',
      'Học bổng về Dinh dưỡng HIV, Bệnh viện Đa khoa San Francisco'
    ],
    certifications: [
      'Chuyên gia Dinh dưỡng Đã đăng ký',
      'Chuyên gia được Chứng nhận về Hỗ trợ Dinh dưỡng',
      'Chuyên gia về Liệu pháp Dinh dưỡng HIV'
    ]
  },
  {
    id: 7,
    name: 'Bác Sĩ Emma Rodriguez',
    specialty: 'Chuyên gia PrEP & Phòng ngừa',
    image: '/images/doctors/doctor7.jpg',
    shortBio: 'Tập trung vào các chiến lược phòng ngừa HIV, quản lý PrEP và giáo dục.',
    fullBio: "Bác Sĩ Emma Rodriguez là Chuyên gia PrEP và Phòng ngừa của chúng tôi, tập trung vào các chiến lược phòng ngừa HIV và giáo dục. Bà nhận bằng y khoa từ Đại học California, San Francisco và hoàn thành đào tạo về Y học Dự phòng.\n\nBác Sĩ Rodriguez giám sát chương trình PrEP (Dự phòng Trước Phơi nhiễm) của chúng tôi, cung cấp tư vấn, kê đơn và theo dõi cho các cá nhân tìm kiếm phòng ngừa HIV. Bà cũng dẫn dắt các sáng kiến giáo dục cộng đồng và các chương trình tư vấn giảm thiểu rủi ro của chúng tôi.",
    education: [
      'Bác sĩ Y khoa, Đại học California, San Francisco',
      'Nội trú về Y học Dự phòng, Đại học Emory',
      'Thạc sĩ Y tế Công cộng, Trường Y tế Công cộng Rollins, Emory'
    ],
    certifications: [
      'Chứng nhận về Y học Dự phòng',
      'Nhà Cung cấp PrEP của Học viện Y học HIV Hoa Kỳ',
      'Chứng nhận về Y tế Công cộng'
    ]
  },
  {
    id: 8,
    name: 'Bác Sĩ David Thompson',
    specialty: 'Giám đốc Quản lý Trường hợp',
    image: '/images/doctors/doctor8.jpg',
    shortBio: 'Chuyên gia công tác xã hội dẫn dắt điều phối dịch vụ hỗ trợ toàn diện.',
    fullBio: "Bác Sĩ David Thompson là Giám đốc Quản lý Trường hợp của chúng tôi, dẫn dắt các dịch vụ hỗ trợ toàn diện của chúng tôi. Ông có bằng Tiến sĩ Công tác Xã hội từ Đại học Columbia với đào tạo chuyên biệt về điều phối chăm sóc sức khỏe và dịch vụ hỗ trợ HIV.\n\nBác Sĩ Thompson giám sát đội ngũ nhân viên quản lý trường hợp của chúng tôi, những người giúp bệnh nhân điều hướng hệ thống chăm sóc sức khỏe, tiếp cận nguồn lực và điều phối chăm sóc. Cách tiếp cận của ông nhấn mạnh vào trao quyền cho bệnh nhân và giải quyết các yếu tố xã hội quyết định sức khỏe để cải thiện kết quả điều trị.",
    education: [
      'Tiến sĩ Công tác Xã hội, Đại học Columbia',
      'Thạc sĩ Công tác Xã hội, Đại học Michigan',
      'Chứng chỉ về Quản lý Y tế, Đại học Johns Hopkins'
    ],
    certifications: [
      'Nhân viên Công tác Xã hội Lâm sàng có Giấy phép',
      'Nhân viên Quản lý Trường hợp được Chứng nhận',
      'Chuyên gia Điều phối Chăm sóc HIV'
    ]
  }
];

// News & Articles
export const news = [
  {
    id: 1,
    title: 'Điều Trị HIV Tác Động Dài Mới Được FDA Phê Duyệt',
    slug: 'new-long-acting-hiv-treatment',
    image: '/images/news/news1.jpg',
    date: {
      day: '15',
      month: 'Th5',
      year: '2023',
      full: 'Ngày 15 tháng 5, 2023'
    },
    summary: 'FDA đã phê duyệt phương pháp điều trị HIV dạng tiêm tác động dài mới chỉ yêu cầu dùng thuốc hai tháng một lần.',
    content: "Trong một bước tiến quan trọng cho việc điều trị HIV, FDA đã phê duyệt một loại thuốc tiêm tác động dài mới chỉ yêu cầu dùng liều hai tháng một lần. Đột phá này cung cấp một lựa chọn thay thế cho các loại thuốc uống hàng ngày vốn là tiêu chuẩn chăm sóc trong nhiều thập kỷ.\n\nPhương pháp điều trị mới, kết hợp hai loại thuốc kháng retrovirus trong một mũi tiêm, đã thể hiện hiệu quả cao trong các thử nghiệm lâm sàng với hồ sơ an toàn tương đương với các phác đồ uống hàng ngày. Đối với nhiều bệnh nhân, đây có thể là một lựa chọn đột phá giúp đơn giản hóa việc điều trị và có khả năng cải thiện sự tuân thủ.\n\n\"Sự phê duyệt này đánh dấu một sự thay đổi mô hình trong cách chúng ta tiếp cận điều trị HIV,\" Bác Sĩ Sarah Johnson, Chuyên Gia Bệnh Truyền Nhiễm của chúng tôi nói. \"Đối với những bệnh nhân gặp khó khăn với việc uống thuốc hàng ngày hoặc đơn giản là thích một lựa chọn khác, phương pháp điều trị tác động dài này có thể cải thiện đáng kể chất lượng cuộc sống trong khi vẫn duy trì sự ức chế virus.\"\n\nTrung tâm của chúng tôi sẽ bắt đầu cung cấp lựa chọn điều trị này cho các bệnh nhân đủ điều kiện bắt đầu từ tháng tới. Những cá nhân quan tâm nên lên lịch tư vấn với nhà cung cấp dịch vụ chăm sóc HIV của họ để thảo luận xem liệu lựa chọn mới này có phù hợp với kế hoạch chăm sóc của họ hay không.",
    author: 'Đội ngũ Y tế',
    category: 'Cập nhật Điều trị'
  },
  {
    id: 2,
    title: 'Phòng Ngừa HIV: Thông Báo Sự Kiện Tuần Lễ Nâng Cao Nhận Thức về PrEP',
    slug: 'prep-awareness-week-events',
    image: '/images/news/news2.jpg',
    date: {
      day: '03',
      month: 'Th6',
      year: '2023',
      full: 'Ngày 3 tháng 6, 2023'
    },
    summary: 'Trung tâm của chúng tôi sẽ tổ chức một loạt các sự kiện giáo dục trong Tuần Lễ Nhận Thức PrEP Quốc gia để thúc đẩy phòng ngừa HIV.',
    content: "Nhân dịp Tuần Lễ Nhận Thức PrEP Quốc gia, Trung tâm Điều trị HIV của chúng tôi sẽ tổ chức một loạt các sự kiện giáo dục và dịch vụ sàng lọc miễn phí tập trung vào phòng ngừa HIV. Dự phòng Trước Phơi nhiễm (PrEP) là một phác đồ thuốc có thể ngăn ngừa nhiễm HIV ở những người âm tính với HIV có thể có nguy cơ.\n\nChương trình kéo dài một tuần sẽ bao gồm:\n\n• Tư vấn PrEP miễn phí với các chuyên gia phòng ngừa của chúng tôi\n• Hội thảo giáo dục trực tuyến về tính đủ điều kiện, hiệu quả và tiếp cận PrEP\n• Xét nghiệm HIV với kết quả trong ngày\n• Hỗ trợ điều hướng bảo hiểm cho việc bao trả PrEP\n• Diễn đàn cộng đồng thảo luận về những tiến bộ trong phòng ngừa HIV\n\n\"PrEP là một công cụ phòng ngừa HIV mạnh mẽ nhưng vẫn chưa được sử dụng đúng mức,\" Bác Sĩ Emma Rodriguez, Chuyên gia PrEP & Phòng ngừa của chúng tôi giải thích. \"Mục tiêu của chúng tôi là tăng cường nhận thức, giải quyết các hiểu lầm và giúp kết nối những cá nhân đủ điều kiện với lựa chọn phòng ngừa quan trọng này.\"\n\nTất cả các sự kiện đều miễn phí và mở cho công chúng. Một số dịch vụ có thể yêu cầu đăng ký trước. Vui lòng truy cập trang Dịch vụ PrEP của chúng tôi để biết lịch trình đầy đủ và thông tin đăng ký.",
    author: 'Đội ngũ Phòng ngừa',
    category: 'Sự kiện'
  },
  {
    id: 3,
    title: 'Nghiên Cứu: Cần Người Tham Gia cho Thử Nghiệm Tối Ưu Hóa Điều Trị HIV',
    slug: 'research-study-treatment-optimization',
    image: '/images/news/news3.jpg',
    date: {
      day: '22',
      month: 'Th4',
      year: '2023',
      full: 'Ngày 22 tháng 4, 2023'
    },
    summary: 'Bộ phận nghiên cứu của chúng tôi đang tuyển người tham gia cho một nghiên cứu mới đánh giá các phác đồ điều trị đơn giản hóa.',
    content: "Bộ phận Nghiên cứu tại Trung tâm Điều trị HIV của chúng tôi hiện đang tuyển người tham gia cho một thử nghiệm lâm sàng điều tra các phác đồ liệu pháp kháng retrovirus được tối ưu hóa. Nghiên cứu nhằm đánh giá hiệu quả và độ an toàn của các phương pháp điều trị đơn giản hóa có thể giảm gánh nặng thuốc và tác dụng phụ tiềm ẩn lâu dài.\n\nNgười tham gia đủ điều kiện bao gồm người lớn sống chung với HIV:\n• Đã sử dụng liệu pháp kháng retrovirus ổn định trong ít nhất 12 tháng\n• Hiện có tải lượng virus không phát hiện được\n• Không có tiền sử kháng thuốc\n• Đáp ứng các tiêu chí sức khỏe bổ sung\n\nViệc tham gia nghiên cứu bao gồm các lần thăm khám định kỳ trong khoảng thời gian 96 tuần, với tất cả dịch vụ chăm sóc và thuốc liên quan đến nghiên cứu được cung cấp miễn phí. Người tham gia cũng sẽ nhận được bồi thường cho thời gian và chi phí đi lại của họ.\n\n\"Nghiên cứu này đại diện cho một bước quan trọng trong nỗ lực liên tục của chúng tôi nhằm cải thiện điều trị HIV,\" Bác Sĩ Lisa Wong, Giám đốc Nghiên cứu của chúng tôi nói. \"Bằng cách khám phá các phác đồ đơn giản hóa, chúng tôi hy vọng sẽ phát triển các lựa chọn duy trì sự ức chế virus tuyệt vời đồng thời có khả năng cải thiện chất lượng cuộc sống và kết quả sức khỏe lâu dài.\"\n\nNhững cá nhân quan tâm có thể tìm hiểu thêm bằng cách liên hệ với Bộ phận Nghiên cứu của chúng tôi hoặc nói chuyện với nhà cung cấp dịch vụ chăm sóc HIV của họ về việc giới thiệu đến đội nghiên cứu.",
    author: 'Bộ phận Nghiên cứu',
    category: 'Nghiên cứu'
  },
  {
    id: 4,
    title: 'Sức Khỏe Tâm Thần và HIV: Ra Mắt Nhóm Hỗ Trợ Mới',
    slug: 'mental-health-support-group',
    image: '/images/news/news4.jpg',
    date: {
      day: '10',
      month: 'Th3',
      year: '2023',
      full: 'Ngày 10 tháng 3, 2023'
    },
    summary: 'Một nhóm hỗ trợ chuyên biệt mới giải quyết các thách thức sức khỏe tâm thần cụ thể khi sống chung với HIV bắt đầu vào tháng tới.',
    content: "Trung tâm của chúng tôi đang ra mắt một nhóm hỗ trợ mới tập trung cụ thể vào sức khỏe tâm thần cho những cá nhân sống chung với HIV. Nhóm này, được hướng dẫn bởi Bác Sĩ Robert Garcia, Bác Sĩ Tâm thần Sức khỏe Tâm thần HIV của chúng tôi, sẽ giải quyết những thách thức tâm lý độc đáo có thể đi kèm với chẩn đoán HIV và điều trị liên tục.\n\nNhóm hỗ trợ sẽ gặp nhau hàng tuần và đề cập đến các chủ đề bao gồm:\n• Quản lý lo âu và trầm cảm\n• Chiến lược đối phó với căng thẳng liên quan đến HIV\n• Đối phó với kỳ thị và lo ngại về việc tiết lộ\n• Xây dựng khả năng phục hồi và thực hành tự chăm sóc\n• Kỹ thuật chánh niệm và giảm căng thẳng\n\n\"Sức khỏe tâm thần là một thành phần quan trọng của sức khỏe tổng thể cho người sống chung với HIV,\" Bác Sĩ Garcia giải thích. \"Nhóm này sẽ cung cấp cả hướng dẫn chuyên môn và hỗ trợ đồng đẳng trong một môi trường an toàn, bảo mật nơi người tham gia có thể chia sẻ kinh nghiệm và phát triển kỹ năng đối phó.\"\n\nNhóm này mở cửa cho tất cả bệnh nhân của trung tâm chúng tôi mà không tính thêm chi phí. Các buổi họp sẽ được tổ chức cả trực tiếp và qua kết nối video bảo mật để tối đa hóa khả năng tiếp cận. Những cá nhân quan tâm nên liên hệ với bộ phận Dịch vụ Sức khỏe Tâm thần của chúng tôi để biết thêm thông tin hoặc đăng ký.",
    author: 'Đội ngũ Sức khỏe Tâm thần',
    category: 'Dịch vụ Hỗ trợ'
  },
  {
    id: 5,
    title: 'Loạt Hội Thảo Dinh Dưỡng: Quản Lý Tác Dụng Phụ Thông Qua Chế Độ Ăn',
    slug: 'nutrition-workshop-side-effects',
    image: '/images/news/news5.jpg',
    date: {
      day: '18',
      month: 'Th2',
      year: '2023',
      full: 'Ngày 18 tháng 2, 2023'
    },
    summary: 'Loạt hội thảo sắp tới sẽ tập trung vào các chiến lược dinh dưỡng để quản lý tác dụng phụ của điều trị và cải thiện sức khỏe tổng thể.',
    content: "Trung tâm Điều trị HIV của chúng tôi đang cung cấp một loạt hội thảo dinh dưỡng mới tập trung vào quản lý tác dụng phụ của thuốc và tối ưu hóa sức khỏe thông qua các phương pháp tiếp cận dinh dưỡng. Được dẫn dắt bởi Bác Sĩ James Wilson, Chuyên gia Dinh dưỡng Chăm sóc Chuyển hóa HIV của chúng tôi, loạt bốn phần này sẽ cung cấp chiến lược thực tế và hướng dẫn cá nhân hóa.\n\nChủ đề hội thảo bao gồm:\n• Phương pháp tiếp cận dinh dưỡng để quản lý tác dụng phụ về tiêu hóa\n• Chiến lược dinh dưỡng cho các thay đổi chuyển hóa và quản lý lipid\n• Lập kế hoạch bữa ăn để tối ưu hóa năng lượng và duy trì cân nặng\n• Hướng dẫn về thực phẩm bổ sung và tương tác giữa dinh dưỡng-thuốc\n\n\"Dinh dưỡng đóng vai trò quan trọng trong chăm sóc HIV, cả trong việc hỗ trợ chức năng miễn dịch và trong quản lý tác dụng phụ của điều trị,\" Bác Sĩ Wilson nói. \"Các hội thảo này sẽ cung cấp phương pháp tiếp cận thực tế, dựa trên bằng chứng mà bệnh nhân có thể áp dụng trong cuộc sống hàng ngày của họ.\"\n\nMỗi hội thảo bao gồm một phần trình diễn với công thức nấu ăn và kế hoạch bữa ăn mẫu. Người tham gia có thể tham dự các buổi riêng lẻ hoặc toàn bộ loạt hội thảo. Đăng ký là bắt buộc, và phí theo thang trượt được áp dụng để đảm bảo khả năng tiếp cận cho tất cả bệnh nhân.",
    author: 'Dịch vụ Dinh dưỡng',
    category: 'Sức khỏe'
  },
  {
    id: 6,
    title: 'HIV và Lão hóa: Mở Rộng Chương Trình Chăm Sóc Chuyên Biệt',
    slug: 'hiv-aging-program-expansion',
    image: '/images/news/news6.jpg',
    date: {
      day: '05',
      month: 'Th1',
      year: '2023',
      full: 'Ngày 5 tháng 1, 2023'
    },
    summary: 'Trung tâm của chúng tôi mở rộng dịch vụ được thiết kế đặc biệt cho nhóm dân số ngày càng tăng của người lớn tuổi sống chung với HIV.',
    content: "Nhận thức được nhu cầu sức khỏe độc đáo của nhóm dân số ngày càng tăng của người lớn tuổi sống chung với HIV, trung tâm của chúng tôi đã mở rộng chương trình HIV và Lão hóa chuyên biệt. Chương trình được nâng cấp kết hợp chăm sóc HIV với phương pháp y học lão khoa để giải quyết nhu cầu chăm sóc sức khỏe phức tạp của nhóm dân số này.\n\nCác dịch vụ mở rộng bao gồm:\n• Đánh giá lão khoa toàn diện cho bệnh nhân HIV trên 50 tuổi\n• Quản lý HIV cùng với các bệnh liên quan đến tuổi tác\n• Đánh giá thuốc để giảm thiểu tương tác thuốc và tác dụng phụ\n• Theo dõi và hỗ trợ sức khỏe nhận thức\n• Nhóm hỗ trợ chuyên biệt cho những người sống sót lâu dài\n\n\"Khi liệu pháp kháng retrovirus đã biến HIV thành một bệnh mãn tính có thể quản lý được, chúng tôi đang thấy nhiều bệnh nhân sống đến tuổi 60, 70 và hơn nữa,\" Bác Sĩ Amara Okafor, người dẫn dắt sáng kiến HIV và Lão hóa giải thích. \"Những cá nhân này đối mặt với những thách thức độc đáo, bao gồm quá trình lão hóa nhanh chóng và quản lý HIV cùng với các bệnh liên quan đến tuổi tác khác.\"\n\nĐội ngũ đa ngành của chương trình bao gồm các chuyên gia về bệnh truyền nhiễm, bác sĩ lão khoa, dược sĩ và nhân viên công tác xã hội cùng hợp tác để cung cấp dịch vụ chăm sóc phối hợp. Bệnh nhân quan tâm đến chương trình HIV và Lão hóa nên nói chuyện với nhà cung cấp dịch vụ HIV chính của họ để được giới thiệu.",
    author: 'Đội ngũ Chăm sóc Lâm sàng',
    category: 'Chăm sóc Bệnh nhân'
  }
];

// Testimonials
export const testimonials = [
  {
    id: 1,
    name: 'Anh Marcus T.',
    image: '/images/testimonials/testimonial1.jpg',
    quote: "Sự chăm sóc tôi nhận được tại trung tâm này đã mang tính chuyển đổi. Từ lần thăm khám đầu tiên, đội ngũ đã đối xử với tôi bằng lòng trắc ẩn và sự tôn trọng, phát triển kế hoạch điều trị phù hợp với nhu cầu cụ thể của tôi.",
    rating: 5
  },
  {
    id: 2,
    name: 'Chị Jennifer L.',
    image: '/images/testimonials/testimonial2.jpg',
    quote: "Tìm thấy trung tâm điều trị HIV này là một sự thay đổi cuộc đời. Cách tiếp cận chăm sóc toàn diện không chỉ giải quyết nhu cầu y tế mà còn cả sức khỏe tổng thể của tôi. Các nhóm hỗ trợ đã kết nối tôi với một cộng đồng mà tôi không biết mình cần đến.",
    rating: 5
  },
  {
    id: 3,
    name: 'Anh David H.',
    image: '/images/testimonials/testimonial3.jpg',
    quote: "Đội ngũ dịch vụ phòng ngừa có kiến thức và không phán xét. Họ đã giúp tôi điều hướng các lựa chọn PrEP và xét nghiệm thường xuyên theo cách phù hợp với lối sống và nhu cầu của tôi.",
    rating: 5
  },
  {
    id: 4,
    name: 'Chị Sophia R.',
    image: '/images/testimonials/testimonial4.jpg',
    quote: 'Tôi đánh giá cao cách tiếp cận toàn diện về chăm sóc HIV tại trung tâm này. Kế hoạch điều trị của tôi bao gồm không chỉ thuốc men mà còn hướng dẫn dinh dưỡng, hỗ trợ sức khỏe tâm thần và các chiến lược sức khỏe.',
    rating: 5
  },
  {
    id: 5,
    name: 'Anh Michael J.',
    image: '/images/testimonials/testimonial5.jpg',
    quote: "Sau khi sống chung với HIV hơn 20 năm, tôi đã trải nghiệm nhiều môi trường chăm sóc sức khỏe. Trung tâm này nổi bật nhờ sự kết hợp giữa các lựa chọn điều trị tiên tiến và sự chăm sóc thực sự đầy trắc ẩn.",
    rating: 5
  }
];

// FAQ
export const faqs = [
  {
    id: 1,
    question: 'Trung tâm cung cấp những lựa chọn xét nghiệm HIV nào?',
    answer: 'Chúng tôi cung cấp nhiều loại xét nghiệm HIV bao gồm xét nghiệm kháng thể nhanh (kết quả trong 20-30 phút), xét nghiệm kháng thể HIV tiêu chuẩn, xét nghiệm RNA để phát hiện sớm và bộ xét nghiệm tại nhà. Tất cả các xét nghiệm đều bảo mật, và các tư vấn viên của chúng tôi cung cấp hướng dẫn trước và sau xét nghiệm. Hầu hết các kế hoạch bảo hiểm đều được chấp nhận, và chúng tôi cũng cung cấp các lựa chọn xét nghiệm miễn phí cho những người đủ điều kiện.'
  },
  {
    id: 2,
    question: 'Bao lâu sau khi có khả năng phơi nhiễm tôi nên đi xét nghiệm?',
    answer: 'Thời điểm xét nghiệm HIV phụ thuộc vào loại xét nghiệm được sử dụng. Xét nghiệm kháng thể có thể phát hiện HIV 23-90 ngày sau khi phơi nhiễm. Xét nghiệm kháng nguyên/kháng thể có thể phát hiện HIV 18-45 ngày sau khi phơi nhiễm. Xét nghiệm axit nucleic (NAT) có thể phát hiện HIV khoảng 10-33 ngày sau khi phơi nhiễm. Nếu bạn đã có khả năng phơi nhiễm gần đây, chúng tôi khuyên bạn nên tham khảo ý kiến của nhà cung cấp dịch vụ chăm sóc sức khỏe, người có thể tư vấn về thời gian xét nghiệm thích hợp nhất và các lựa chọn cho tình huống của bạn.'
  },
  {
    id: 3,
    question: 'PrEP là gì và nó hiệu quả như thế nào?',
    answer: 'PrEP (Dự phòng Trước Phơi nhiễm) là một loại thuốc được sử dụng bởi những người âm tính với HIV để ngăn ngừa nhiễm HIV. Khi được sử dụng theo chỉ định, PrEP giảm nguy cơ nhiễm HIV qua đường tình dục khoảng 99% và qua đường tiêm chích ma túy ít nhất 74%. Trung tâm của chúng tôi cung cấp đơn thuốc PrEP, theo dõi thường xuyên và dịch vụ hỗ trợ để đảm bảo sử dụng an toàn và hiệu quả. Chúng tôi cũng giúp điều hướng bảo hiểm và các chương trình hỗ trợ để làm cho PrEP trở nên giá cả phải chăng.'
  },
  {
    id: 4,
    question: 'Tôi nên làm gì nếu tôi vừa bị phơi nhiễm HIV gần đây?',
    answer: 'Nếu bạn tin rằng bạn đã bị phơi nhiễm HIV trong 72 giờ qua, hãy đến trung tâm của chúng tôi ngay lập tức hoặc đến phòng cấp cứu để hỏi về PEP (Dự phòng Sau Phơi nhiễm). PEP là thuốc khẩn cấp có thể ngăn ngừa nhiễm HIV nếu được bắt đầu nhanh chóng sau khi phơi nhiễm. PEP càng bắt đầu sớm càng hiệu quả—lý tưởng nhất là trong vòng 24 giờ, nhưng có thể bắt đầu trong vòng tối đa 72 giờ sau khi phơi nhiễm. Trung tâm của chúng tôi cung cấp dịch vụ PEP với chăm sóc theo dõi và hỗ trợ.'
  },
  {
    id: 5,
    question: 'Tôi cần gặp bác sĩ thường xuyên như thế nào cho dịch vụ chăm sóc HIV?',
    answer: 'Tần suất thăm khám chăm sóc HIV phụ thuộc vào tình trạng sức khỏe cá nhân, kế hoạch điều trị và thời gian bạn được chẩn đoán. Thông thường, bệnh nhân mới hoặc những người bắt đầu điều trị có thể có các lần thăm khám cách 1-3 tháng. Khi đã ổn định với việc điều trị và có tải lượng virus không phát hiện được, các lần thăm khám có thể được lên lịch cách 3-6 tháng. Mỗi lần thăm khám bao gồm theo dõi tải lượng virus, số lượng CD4, sức khỏe tổng thể và hiệu quả của thuốc. Đội ngũ chăm sóc của chúng tôi sẽ phát triển lịch theo dõi được điều chỉnh theo nhu cầu cụ thể của bạn.'
  },
  {
    id: 6,
    question: 'Trung tâm cung cấp những dịch vụ hỗ trợ nào ngoài chăm sóc y tế?',
    answer: 'Chúng tôi cung cấp nhiều dịch vụ hỗ trợ toàn diện bao gồm: quản lý trường hợp để giúp điều phối chăm sóc sức khỏe và tiếp cận nguồn lực; dịch vụ sức khỏe tâm thần bao gồm trị liệu cá nhân và nhóm hỗ trợ; tư vấn dinh dưỡng; hỗ trợ tuân thủ dùng thuốc; hướng dẫn bảo hiểm; giới thiệu điều trị sử dụng chất gây nghiện; hỗ trợ nhà ở và vận chuyển; giới thiệu chăm sóc nha khoa; và giới thiệu dịch vụ pháp lý. Mục tiêu của chúng tôi là giải quyết tất cả các yếu tố ảnh hưởng đến sức khỏe và chất lượng cuộc sống của bạn.'
  },
  {
    id: 7,
    question: 'Làm thế nào để đăng ký làm bệnh nhân mới tại trung tâm của các bạn?',
    answer: 'Để trở thành bệnh nhân mới, bạn có thể bắt đầu bằng cách gọi đến đường dây tiếp nhận của chúng tôi hoặc điền vào mẫu bệnh nhân mới trên trang web của chúng tôi. Chúng tôi sẽ lên lịch hẹn ban đầu, nơi bạn sẽ gặp nhân viên quản lý trường hợp và nhà cung cấp dịch vụ chăm sóc sức khỏe. Vui lòng mang theo giấy tờ tùy thân, thông tin bảo hiểm và bất kỳ hồ sơ y tế hoặc danh sách thuốc nếu có. Trong lần thăm khám đầu tiên này, chúng tôi sẽ thu thập tiền sử y tế của bạn, thực hiện các xét nghiệm cơ bản và bắt đầu phát triển kế hoạch chăm sóc cá nhân hóa của bạn. Chúng tôi chào đón tất cả bệnh nhân bất kể tình trạng bảo hiểm hoặc khả năng chi trả.'
  }
];

// Locations
export const locations = [
  {
    id: 1,
    name: 'Trung Tâm Điều Trị Chính',
    address: '123 Medical Center Drive, Suite 200, New York, NY 10001',
    phone: '(800) 123-4567',
    email: 'info@hivtreatmentcenter.org',
    hours: 'Thứ Hai-Thứ Sáu: 8:00 - 18:00, Thứ Bảy: 9:00 - 13:00',
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    },
    services: [
      'Xét Nghiệm & Sàng Lọc HIV',
      'Liệu Pháp Kháng Retrovirus',
      'PrEP & Phòng Ngừa',
      'Dịch Vụ Tư Vấn',
      'Quản Lý Trường Hợp',
      'Dinh Dưỡng & Sức Khỏe',
      'Nhóm Hỗ Trợ',
      'Chương Trình Nghiên Cứu'
    ]
  },
  {
    id: 2,
    name: 'Phòng Khám Trung Tâm',
    address: '456 Community Health Blvd, New York, NY 10002',
    phone: '(800) 123-4569',
    email: 'downtown@hivtreatmentcenter.org',
    hours: 'Thứ Hai-Thứ Sáu: 10:00 - 20:00, Thứ Bảy: 10:00 - 14:00',
    coordinates: {
      lat: 40.7112,
      lng: -73.9974
    },
    services: [
      'Xét Nghiệm & Sàng Lọc HIV',
      'PrEP & Phòng Ngừa',
      'Liệu Pháp Kháng Retrovirus',
      'Dịch Vụ Xét Nghiệm Không Hẹn Trước',
      'Chương Trình Tập Trung Cho Thanh Niên'
    ]
  },
  {
    id: 3,
    name: 'Trung Tâm Nghiên Cứu & Giáo Dục',
    address: '789 Innovation Way, Suite 300, New York, NY 10003',
    phone: '(800) 123-4570',
    email: 'research@hivtreatmentcenter.org',
    hours: 'Thứ Hai-Thứ Sáu: 9:00 - 17:00',
    coordinates: {
      lat: 40.7281,
      lng: -73.9942
    },
    services: [
      'Thử Nghiệm Lâm Sàng',
      'Chương Trình Nghiên Cứu',
      'Hội Thảo Giáo Dục',
      'Đào Tạo Chuyên Môn',
      'Tiếp Cận Cộng Đồng'
    ]
  }
]; 