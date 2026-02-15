document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("submit-btn");
  const spinner = submitBtn.querySelector("[data-spinner]");
  const label = submitBtn.querySelector("[data-label]");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  const showToast = (type, message) => {
    toast.classList.remove(
      "hidden",
      "border-emerald-200",
      "bg-emerald-50",
      "text-emerald-800",
      "border-rose-200",
      "bg-rose-50",
      "text-rose-800"
    );
    if (type === "success") {
      toast.classList.add("border-emerald-200", "bg-emerald-50", "text-emerald-800");
    } else {
      toast.classList.add("border-rose-200", "bg-rose-50", "text-rose-800");
    }
    toastMessage.textContent = message;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      category: form.category.value,
      message: form.message.value.trim(),
      privacy: form.privacy.checked,
    };

    if (!payload.privacy) {
      showToast("error", "個人情報の取り扱いに同意してください。");
      return;
    }

    submitBtn.disabled = true;
    spinner.classList.remove("hidden");
    label.textContent = "送信中...";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({ ok: false, error: "通信に失敗しました。" }));

      if (response.ok && data.ok) {
        showToast("success", "送信が完了しました。担当よりご連絡します。");
        form.reset();
      } else {
        showToast("error", data.error || "送信に失敗しました。");
      }
    } catch (error) {
      showToast("error", "ネットワークエラーが発生しました。");
    } finally {
      submitBtn.disabled = false;
      spinner.classList.add("hidden");
      label.textContent = "送信する";
    }
  });
});
