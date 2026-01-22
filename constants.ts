
import { Employee, Holiday } from './types';

// Managers (Lead Team) - General Pool
export const GENERAL_MANAGERS: Employee[] = [
  { name: "อรอุมา วงษ์พานิช", position: "Deputy Manager", department: "Nursing Staff Organization" }, // Swapped from index 21 (W22) to index 0 (W1)
  { name: "ลัดดา ทวีศักดิ์", position: "Senior Nurse Manager", department: "Nursing Staff Organization" },
  { name: "แสงรวี ศรีงาม", position: "Imaging Manager", department: "Imaging" },
  { name: "วัฒนา รัตนดิลก ณ ภูเก็ต", position: "Asst. Nursing Director", department: "Nursing Staff Organization" },
  { name: "ศิริกุล การดา", position: "Pharmacy Manager", department: "Pharmacy" },
  { name: "นงนุช เชาว์วัฒนาพร", position: "Quality Nursing Manager", department: "Nursing Staff Organization" },
  { name: "นาฎกมล จำรัสกาญจน์", position: "Patient Experience Manager", department: "Customer Experience Management" },
  { name: "ชวาลิณทร์ มนต์อุ่น", position: "Special Project Management Mgr", department: "Administration Office" },
  { name: "จุฬาภรณ์ พรหมน้อย", position: "IPD Manager", department: "In Patient Division" },
  { name: "นิยมพงษ์ ต่อวงศ์", position: "Corporate Communication & Branding Manager", department: "Corporate Communication & Branding" },
  { name: "ขวัญตา รักษ์ธรรมกิจ", position: "Account & Finance Manager", department: "Accounting and Finance" },
  { name: "ทินรัตน์ ปราบประชา", position: "IPUs 5 Manager", department: "IPUs 5" },
  { name: "มณีวรรณ แก้วจันทร์ศรี", position: "IPUs 1 Manager", department: "IPUs 1" },
  { name: "ศรีสุดา จิตต์วิรัช", position: "Deputy Account & Finance Mgr.", department: "Accounting and Finance" },
  { name: "ศิวรักษ์ เพ็ชรเพ็ง", position: "Deputy Manager", department: "Hospital Affairs" },
  { name: "ธนิดา ไกรเทพ", position: "IPUs 2 Manager", department: "IPUs 2" },
  { name: "โกศล บ่อทอง", position: "Deputy Manager", department: "Marketing Division" },
  { name: "นิลุบล อำนวยผล", position: "UM Manager", department: "Utilization Management" },
  { name: "ศิริศักดิ์ ใหญ่สูงเนิน", position: "Medical Informatics Development Manager", department: "Medical Informatics Development" },
  { name: "เศรษฐพัส ณ ถลาง", position: "Digital Marketing Manager", department: "Digital Marketing" },
  { name: "นิติพงศ์ รักมาก", position: "SHE Manager", department: "Safety Occupational Health&Env" },
  { name: "ภรณี พวงจิต", position: "Medical Affairs Office Manager", department: "Medical Affairs Office" }, // Swapped from index 0 (W1) to index 21 (W22)
  { name: "สุพรรณิการ์ พูนธนานิวัฒน์กุล", position: "Quality Center Manager", department: "Quality Center" },
  { name: "ปฏิพัทธฬ์ ประเสริฐวิทยากิจ", position: "General Support Division Mgr.", department: "General Support Division" },
  { name: "ราตรี แซ่ตัน", position: "Supervisor Manager", department: "Supervisor Office" },
  { name: "ฝนทิพย์ รุ่งเรืองศรี", position: "Business Development Manager", department: "Business Development" },
  { name: "ดรุณี จิตวารินทร์", position: "Deputy Data Management Mgr.", department: "Accounting and Finance" },
  { name: "จตุพร ระเด่น", position: "HRM Manager", department: "Human Resources Management" },
  { name: "ฐิตาภรณ์ ปิยะพสิษฐ์", position: "Logistic and Inventory Manager", department: "Inventory" }
];

// Managers (Lead Team) - Priority Last
export const LAST_PRIORITY_MANAGERS: Employee[] = [
  { name: "ปรียานุช วงศ์พาณิชย์", position: "IPUs 4 Manager", department: "IPUs 4" },
  { name: "ศรีสุดา เกษศรี", position: "Critical Care Manager", department: "Critical Care" },
  { name: "กาญจณา พันธุ์ไชยศรี", position: "Deputy Manager", department: "Hospital Informatic" },
  { name: "โสภา สินธุเสน", position: "IPUs 3 Manager", department: "IPUs 3" },
  { name: "เสาวรีย์ เกตุเรน", position: "IPUs 7 Manager", department: "IPUs 7" }
];

// HODs (Co-lead Team) - Priority First
export const PRIORITY_HODS: Employee[] = [
  { name: "อันชะรินทร์ วิลเลียมสัน", position: "Occupational Therapy HOD", department: "Occupational Therapy" },
  { name: "พัชรี สังข์ทอง", position: "Heart Clinic HOD", department: "Heart Clinic" },
  { name: "อรุณรัตน์ วิเศษสิงห์", position: "Nursing Education HOD", department: "Nursing Staff Organization" },
  { name: "อดุล ปลูกไม้ดี", position: "Ambulance Service & Vehicle HOD", department: "Ambulance Service" },
  { name: "ณปภัช ศรีสุข", position: "Cashier HOD", department: "Cashier" },
  { name: "สวนัย นิลวรรณ", position: "International Services HOD", department: "International Services" },
  { name: "สุวรรณา พะลีราช", position: "General Support HOD", department: "General Support Division" },
  { name: "ศศิธร มิ่งวัน", position: "Administration Office HOD", department: "Administration Office" },
  { name: "ไรหนาบ ราษฎร์นิยม", position: "Nutrition & Dietetics HOD", department: "Food & Nutrition" },
  { name: "นฤดี สาลิกา", position: "OPD Pharmacy HOD", department: "Pharmacy" },
  { name: "กัญช์ เกสรสุคนธ์", position: "Mental Health Clinic HOD", department: "Mental Health Clinic" },
  { name: "วีรวรรณ รัตนพันธุ์", position: "Hemodialysis HOD", department: "Hemodialysis" },
  { name: "กาญจนา รัศมีอร่ามวงศ์", position: "PR & Event Marketing HOD", department: "Event Marketing" },
  { name: "พงศ์วรัท แซ่เจี่ย", position: "Customer Services HOD", department: "Customer Services" },
  { name: "สินีนาฎ จำรัสกาญจน์", position: "IPD Pharmacy HOD", department: "IPD Pharmacy" },
  { name: "พรศิริ ลิ่มวัฒนวงศ์", position: "IC HOD", department: "Infection Control" },
  { name: "ณัฐกฤตา อัญชิสาชนิภา", position: "Collection HOD", department: "Collection" },
  { name: "ชลธิรา ลาตเวร", position: "Ward 7A HOD", department: "Ward 7A" },
  { name: "วพีร์ ขันธจีรวัฒน์", position: "Orthopedic Surgery HOD", department: "Orthopedic Surgery" },
  { name: "ไตรภพ คำวิเศษณ์", position: "Facility Management HOD", department: "Facility Management" },
  { name: "ณัฐวุฒิ หนูหมื่น", position: "HRD HOD", department: "Human Resources Development" },
  { name: "ไอลดา บุณโยดม", position: "Overseas Marketing HOD", department: "Overseas Marketing" },
  { name: "รัฐกร คงสมกัน", position: "Physical Therapy HOD", department: "Physical Therapy" },
  { name: "วีรวัฒน์ ดนตรีเจริญ", position: "Multimedia Marketing HOD", department: "Creative Multimedia" },
  { name: "ชนัญชิดา เกลี้ยงเกลา", position: "Digital & Social Media MKT HOD", department: "Digital Marketing" },
  { name: "ชญธร ปกแก้วลิพร", position: "Strategic Management HOD", department: "Strategic Management" },
  { name: "ญาณะภัทร จารุธนสารกุล", position: "Facility Management Specialist", department: "Facility Management" }
];

// HODs (Co-lead Team) - General Pool
export const GENERAL_HODS: Employee[] = [
  { name: "พุทธชาด วรธรรมาภรณ์", position: "Outreach Clinic HOD", department: "Outreach Clinic" },
  { name: "ศรีสุดา เชิงสุวรรณวงศ์", position: "BDMS Wellness Clinic Laguna HOD", department: "BDMS Wellness Clinic Laguna" },
  { name: "อมรรัตน์ วิเศษสิงห์", position: "Colorectal HOD", department: "Colorectal Disease Institute" },
  { name: "สุภาวดี สังข์ทอง", position: "ICU HOD", department: "Intensive Care Unit" },
  { name: "วาสนา พูลภิรมย์", position: "OR HOD", department: "Operating Room" },
  { name: "เสาวลักษณ์ อุทัชกุล", position: "Ward 5B HOD", department: "Ward 5B" },
  { name: "มยุรี ขุนมี", position: "GI & Liver HOD", department: "Gastroenterology" },
  { name: "สมรักษ์ แสงเพลิง", position: "Cardiac Care Unit HOD", department: "Cardiac Care Unit" },
  { name: "จุไรภรณ์ พลหาญ", position: "OB & GYN HOD", department: "Obstetrics & Gynecology" },
  { name: "สุธาศินี พิบาลฆ่าสัตว์", position: "Urology HOD", department: "Urology" },
  { name: "จุไรพร คงทองอ่อน", position: "Cardiac Cath Lab HOD", department: "Cardiac Cath Lab" },
  { name: "รณวีร์ ยอดวารี", position: "Ward 4A 4B HOD", department: "Ward 4B" },
  { name: "รัตนาวดี ตรีทิพย์ธิคุณ", position: "UM HOD", department: "Utilization Management" },
  { name: "นิตยา สมรูป", position: "SICU HOD", department: "SICU" },
  { name: "ปาริชาติ ทับไทย", position: "ER & EMS HOD", department: "Emergency" },
  { name: "วริษา เสริมสุข", position: "Nursery & LR HOD", department: "Nursery" },
  { name: "กนกพร บุญรอด", position: "Medical Record HOD", department: "Medical Record" },
  { name: "จุฬาลักษณ์ ติวรานุสรณ์", position: "Sales Referral HOD", department: "Referral Marketing" },
  { name: "นิภารัตน์ บัวทองคำ", position: "Neurology HOD", department: "Neurology" },
  { name: "สุพรรณี ปรีดาศักดิ์", position: "IMCU & Ward 6B HOD", department: "Intermediate Intensive Care" },
  { name: "พรชนก ทองตัน", position: "Price Estimation&Admission HOD", department: "Admission" },
  { name: "รวิพรรณ คชวงศ์", position: "Ward 7B HOD", department: "Ward 7B" },
  { name: "ภาวิตา วิภวกานต์", position: "Pediatrics HOD", department: "Pediatrics" },
  { name: "กัลยาณี เคทอง", position: "Eye & Bright View HOD", department: "Eye Center" },
  { name: "เอกศิษย์ หนูนาค", position: "Patient Escort HOD", department: "Patient Escort" },
  { name: "พัทรีญา เจี่ยสกุล", position: "BDMS Wellness Clinic Phuket HOD", department: "Health Promotion" },
  { name: "จุฑาทิพย์ บัวอินทร์", position: "Dental HOD", department: "Dental" },
  { name: "ฉัตรแก้ว ไทยเจริญ", position: "Medicine HOD", department: "Medicine Unit" },
  { name: "จตุพร เอี่ยมคล้าย", position: "Registration HOD", department: "Registration" },
  { name: "ชญาดา นิรันตรายกุล", position: "Ward 3B HOD", department: "Ward 3B" },
  { name: "พิมลพรรณ เกษมุล", position: "Ward 8A HOD", department: "Ward 8A" },
  { name: "รอกีเยาะ อาแว", position: "Ward 6A HOD", department: "Ward 6A" },
  { name: "สุพิชฌาย์ กิจสุวรรณมณี", position: "Ward 8B HOD", department: "Ward 8B" },
  { name: "กรรณิกา แซ่ลี", position: "Accounting HOD", department: "Accounting" },
  { name: "สุชีวะ แสวงมี", position: "Anesthetic HOD", department: "Anesthetic" },
  { name: "สุภาพร คำทองอินทร์", position: "Dispatch Center HOD", department: "Dispatch Center" }
];

// Thai Public Holidays 2026
export const HOLIDAYS_2026: Holiday[] = [
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-02-11", name: "Makha Bucha Day" },
  { date: "2026-04-06", name: "Chakri Memorial Day" },
  { date: "2026-04-13", name: "Songkran Festival" },
  { date: "2026-04-14", name: "Songkran Festival" },
  { date: "2026-04-15", name: "Songkran Festival" },
  { date: "2026-05-01", name: "Labor Day" },
  { date: "2026-05-04", name: "Coronation Day" },
  { date: "2026-06-01", name: "Wisakha Bucha Day (Observed)" },
  { date: "2026-06-03", name: "H.M. Queen Suthida's Birthday" },
  { date: "2026-07-28", name: "H.M. King Rama X's Birthday" },
  { date: "2026-07-29", name: "Asahna Bucha Day" },
  { date: "2026-08-12", name: "H.M. Queen Sirikit The Queen Mother's Birthday / Mother's Day" },
  { date: "2026-10-13", name: "H.M. King Bhumibol Adulyadej Memorial Day" },
  { date: "2026-10-23", name: "Chulalongkorn Day" },
  { date: "2026-12-05", name: "H.M. King Bhumibol Adulyadej's Birthday / Father's Day" },
  { date: "2026-12-07", name: "Father's Day (Observed)" },
  { date: "2026-12-10", name: "Constitution Day" },
  { date: "2026-12-31", name: "New Year's Eve" },
  { date: "2027-01-01", name: "New Year's Day" }
];
