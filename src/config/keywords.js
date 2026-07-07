export const SITE = {
  name: "법무법인 윤빛",
  brand: "윤빛 금융사기 공동대응센터",
  domain: "www.yb-scam.com",
  phone: "010-2175-4252",
  tel: "01021754252",
  kakao: "https://open.kakao.com/o/sEEHGIti",
  email: "contact@yoonbitlawfirm.com"
};

/**
 * 현재 단계 키워드 정규화 규칙
 *
 * - 공백만 제거
 * - 하이픈(-)은 유지
 *
 * 예시:
 * "코인-사기" → "코인-사기"
 * "코인 사기" → "코인사기"
 * "출금-거부" → "출금-거부"
 * "출금 거부" → "출금거부"
 */
export function normalizeKeyword(value = "") {
  try {
    return decodeURIComponent(String(value))
      .replace(/\s+/g, "")
      .trim();
  } catch (_) {
    return String(value)
      .replace(/\s+/g, "")
      .trim();
  }
}

/**
 * 현재 단계에서는 SEO/자동치환 전부 제외.
 * 서버렌더링으로 키워드가 제대로 들어오는지만 확인한다.
 */
export function getKeywordData(rawKeyword = "금융사기상담") {
  const keyword = normalizeKeyword(rawKeyword || "금융사기상담");

  return {
    keyword
  };
}