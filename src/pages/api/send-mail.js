export async function POST({ request, clientAddress }) {
  try {
    const body = await request.json();
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "RESEND_API_KEY가 없습니다.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const cleanPhone = phone.replace(/[^\d]/g, "");
    const company = String(body.company || "").trim();
    const amount = String(body.amount || "").trim();
    const keyword = String(body.keyword || "금융범죄").trim();
    const pageUrl = String(body.pageUrl || "").trim();
    const userAgent = String(body.userAgent || "").trim();
    const honeypot = String(body.website || "").trim();

    if (honeypot) {
      return new Response(
        JSON.stringify({ success: true, ignored: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!name || !phone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "이름과 연락처는 필수입니다.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (cleanPhone.length < 9 || cleanPhone.length > 12) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "연락처 형식이 올바르지 않습니다.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const submittedAt = new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());

    const subject = `[윤빛 상담신청 접수] ${keyword} / ${name} / ${phone}`;

    const html = `
      <div style="font-family:Arial,'Noto Sans KR',sans-serif;line-height:1.7;color:#111;">
        <h2 style="margin:0 0 16px;">법무법인 윤빛 상담신청 접수</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #ddd;">
          <tbody>
            <tr>
              <th style="width:140px;text-align:left;background:#f7f7f7;padding:10px;border:1px solid #ddd;">접수시간</th>
              <td style="padding:10px;border:1px solid #ddd;">${submittedAt}</td>
            </tr>
            <tr>
              <th style="text-align:left;background:#f7f7f7;padding:10px;border:1px solid #ddd;">키워드</th>
              <td style="padding:10px;border:1px solid #ddd;">${escapeHtml(keyword)}</td>
            </tr>
            <tr>
              <th style="text-align:left;background:#f7f7f7;padding:10px;border:1px solid #ddd;">이름</th>
              <td style="padding:10px;border:1px solid #ddd;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <th style="text-align:left;background:#f7f7f7;padding:10px;border:1px solid #ddd;">연락처</th>
              <td style="padding:10px;border:1px solid #ddd;">${escapeHtml(phone)}</td>
            </tr>
            <tr>
              <th style="text-align:left;background:#f7f7f7;padding:10px;border:1px solid #ddd;">숫자 연락처</th>
              <td style="padding:10px;border:1px solid #ddd;">${escapeHtml(cleanPhone)}</td>
            </tr>
            <tr>
              <th style="text-align:left;background:#f7f7f7;padding:10px;border:1px solid #ddd;">피해 업체명</th>
              <td style="padding:10px;border:1px solid #ddd;">${escapeHtml(company || "미입력")}</td>
            </tr>
            <tr>
              <th style="text-align:left;background:#f7f7f7;padding:10px;border:1px solid #ddd;">입금 금액</th>
              <td style="padding:10px;border:1px solid #ddd;">${escapeHtml(amount || "미입력")}</td>
            </tr>
            <tr>
              <th style="text-align:left;background:#f7f7f7;padding:10px;border:1px solid #ddd;">접수 페이지</th>
              <td style="padding:10px;border:1px solid #ddd;">${escapeHtml(pageUrl || "확인 불가")}</td>
            </tr>
            <tr>
              <th style="text-align:left;background:#f7f7f7;padding:10px;border:1px solid #ddd;">IP</th>
              <td style="padding:10px;border:1px solid #ddd;">${escapeHtml(clientAddress || "확인 불가")}</td>
            </tr>
            <tr>
              <th style="text-align:left;background:#f7f7f7;padding:10px;border:1px solid #ddd;">User-Agent</th>
              <td style="padding:10px;border:1px solid #ddd;">${escapeHtml(userAgent || "확인 불가")}</td>
            </tr>
          </tbody>
        </table>
        <p style="margin-top:18px;color:#666;font-size:13px;">
          본 메일은 yb-scam.com 랜딩페이지 상담신청 폼에서 자동 발송되었습니다.
        </p>
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "YOONBIT <onboarding@resend.dev>",
        to: ["yoonbitlawfirm@gmail.com"],
        subject,
        html,
      }),
    });

    const data = await resendResponse.json();

    if (!resendResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          data,
        }),
        {
          status: resendResponse.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}