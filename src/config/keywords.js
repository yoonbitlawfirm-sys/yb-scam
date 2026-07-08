export const SITE = {
  name: "법무법인 윤빛",
  brand: "윤빛 금융사기 공동대응센터",
  domain: "www.yb-scam.com",
  phone: "010-2290-4252",
  tel: "01022904252",
  kakao: "https://open.kakao.com/o/sd4HGIti",
  email: "contact@yoonbitlawfirm.com"
};

export function normalizeKeyword(value = "") {
  try {
    return decodeURIComponent(String(value))
      .replace(/\+/g, " ")
      .replace(/[<>]/g, "")
      .replace(/["'`{}]/g, "")
      .replace(/\s+/g, "")
      .trim()
      .slice(0, 42);
  } catch (_) {
    return String(value)
      .replace(/\+/g, " ")
      .replace(/[<>]/g, "")
      .replace(/["'`{}]/g, "")
      .replace(/\s+/g, "")
      .trim()
      .slice(0, 42);
  }
}

export function getKeywordData(rawKeyword = "금융범죄") {
  const keyword = normalizeKeyword(rawKeyword || "금융범죄");

  return {
    keyword
  };
}