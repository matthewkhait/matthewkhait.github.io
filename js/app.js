// js/app.js
(function(){
  const $ = (id) => document.getElementById(id);

  const navToggle = $("navToggle");
  const mobileNav = $("mobileNav");

  function setMobileNavOpen(isOpen){
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    mobileNav.hidden = !isOpen;
  }

  if (navToggle && mobileNav){
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      setMobileNavOpen(!open);
    });

    mobileNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => setMobileNavOpen(false));
    });
  }

  const year = $("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Pricing buttons -> preselect package
  document.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan');
      const sel = $("packageSelect");
      if (sel && plan) sel.value = plan;
    });
  });

  const orderForm = $("orderForm");
  const result = $("result");
  const resultText = $("resultText");
  const mailtoBtn = $("mailtoBtn");
  const copyBtn = $("copyBtn");

  // Change this to your business inbox:
  const destinationEmail = "hello@yourdomain.com";

  function toCleanLine(value){
    const v = String(value || "").trim();
    return v.length ? v : "(not provided)";
  }

  function buildMessage(data){
    return [
      "New Logo Request",
      "----------------",
      `Name: ${toCleanLine(data.fullName)}`,
      `Email: ${toCleanLine(data.email)}`,
      `Brand name: ${toCleanLine(data.brandName)}`,
      `Package: ${toCleanLine(data.package)}`,
      "",
      "Style direction:",
      toCleanLine(data.style),
      "",
      `Colors: ${toCleanLine(data.colors)}`,
      `Deadline: ${toCleanLine(data.deadline)}`,
      "",
      "Notes:",
      toCleanLine(data.notes),
      "",
      "—",
      "Sent from CustomLogoStudio website"
    ].join("\n");
  }

  function encodeMailto(subject, body){
    return "mailto:" + encodeURIComponent(destinationEmail)
      + "?subject=" + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(body);
  }

  async function copyToClipboard(text){
    try{
      await navigator.clipboard.writeText(text);
      return true;
    }catch{
      // Fallback
      try{
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      }catch{
        return false;
      }
    }
  }

  if (orderForm){
    orderForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fd = new FormData(orderForm);
      const data = Object.fromEntries(fd.entries());

      const subject = `Logo Request — ${toCleanLine(data.brandName)} (${toCleanLine(data.package)})`;
      const body = buildMessage(data);

      if (result && resultText && mailtoBtn){
        result.hidden = false;
        resultText.value = body;
        mailtoBtn.href = encodeMailto(subject, body);
      }

      if (copyBtn){
        copyBtn.disabled = false;
        copyBtn.onclick = async () => {
          const ok = await copyToClipboard(body);
          copyBtn.textContent = ok ? "Copied!" : "Copy failed";
          setTimeout(() => { copyBtn.textContent = "Copy message"; }, 1400);
        };
      }
    });
  }
})();
