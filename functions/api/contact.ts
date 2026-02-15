type ContactPayload = {
  name: string;
  email: string;
  category: string;
  message: string;
  privacy: boolean;
};

type Env = {
  RESEND_API_KEY: string;
  ADMIN_EMAIL: string;
  FROM_EMAIL: string;
};

const allowedCategories = ["農家", "飲食店・施設・企業", "その他"];

const jsonResponse = (data: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validate = (payload: ContactPayload) => {
  if (!payload.name || payload.name.length < 1 || payload.name.length > 60) {
    return "お名前を正しく入力してください。";
  }
  if (!payload.email || payload.email.length < 3 || payload.email.length > 120 || !isValidEmail(payload.email)) {
    return "メールアドレスを正しく入力してください。";
  }
  if (!allowedCategories.includes(payload.category)) {
    return "区分を選択してください。";
  }
  if (!payload.message || payload.message.length < 1 || payload.message.length > 1000) {
    return "内容を正しく入力してください。";
  }
  if (!payload.privacy) {
    return "個人情報の取り扱いに同意してください。";
  }
  return null;
};

const sendEmail = async (env: Env, payload: Record<string, unknown>) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "送信に失敗しました。");
  }
};

export const onRequestGet = () => {
  return jsonResponse({ ok: false, error: "POSTのみ対応しています。" }, 405);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.RESEND_API_KEY || !env.ADMIN_EMAIL || !env.FROM_EMAIL) {
    return jsonResponse({ ok: false, error: "サーバー設定が不足しています。" }, 500);
  }

  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch (error) {
    return jsonResponse({ ok: false, error: "送信内容を確認してください。" }, 400);
  }

  const validationError = validate(payload);
  if (validationError) {
    return jsonResponse({ ok: false, error: validationError }, 400);
  }

  const adminSubject = "【ベジタブルキャリー】お問い合わせが届きました";
  const adminText = [
    "お問い合わせが届きました。",
    "",
    `お名前: ${payload.name}`,
    `メール: ${payload.email}`,
    `区分: ${payload.category}`,
    "内容:",
    payload.message,
  ].join("\n");

  const userSubject = "お問い合わせありがとうございます｜株式会社FRESH LINE";
  const userText = [
    `${payload.name} 様`,
    "",
    "お問い合わせありがとうございます。内容を確認のうえ、担当よりご連絡いたします。",
    "",
    "受信内容",
    `区分: ${payload.category}`,
    `内容: ${payload.message}`,
    "",
    "株式会社FRESH LINE",
    "命を運ぶ。想いを繋ぐ。",
  ].join("\n");

  try {
    await sendEmail(env, {
      from: env.FROM_EMAIL,
      to: env.ADMIN_EMAIL,
      subject: adminSubject,
      text: adminText,
      reply_to: payload.email,
    });

    await sendEmail(env, {
      from: env.FROM_EMAIL,
      to: payload.email,
      subject: userSubject,
      text: userText,
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: "送信に失敗しました。時間をおいて再度お試しください。" }, 500);
  }
};
