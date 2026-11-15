const view = document.querySelector("#view");
const attemptKey = "kuis-daya.active-attempt";
const wib = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "short",
});
const isRecap = location.pathname === "/rekap" || new URLSearchParams(location.search).get("halaman") === "rekap";
const focusGraceMs = 1000;
const fallbackStorage = new Map();
const tabData = {
  getItem(key) { try { return sessionStorage.getItem(key); } catch { return fallbackStorage.get(key); } },
  setItem(key, value) { try { sessionStorage.setItem(key, value); } catch { fallbackStorage.set(key, value); } },
  removeItem(key) { try { sessionStorage.removeItem(key); } catch { fallbackStorage.delete(key); } },
};
document.querySelector(isRecap ? "#nav-teacher" : "#nav-student").setAttribute("aria-current", "page");

let attempt = null;
let questions = [];
let answers = {};
let position = 0;
let timeOffset = 0;
let pendingResets = new Set();
let resetSync = null;
let leftPage = false;
let focusLostAt = null;
let focusLossTimer;
let submitting = false;
let notice = "";

function display(markup) {
  view.innerHTML = markup;
  initializePasswordToggles(view);
  view.setAttribute("aria-busy", "false");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function showError(id, message) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = message;
    element.hidden = !message;
  }
}

async function quizRequest(action, body) {
  let response;
  let data;
  try {
    response = await fetch("/api/quiz/" + action, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
      keepalive: action === "reset",
    });
    data = await response.json();
  } catch {
    throw new Error("Server tidak dapat dihubungi. Coba lagi.");
  }
  if (response.ok && !data.error) return data;
  const error = new Error(data.error || "Permintaan belum berhasil. Coba lagi.");
  error.status = response.status;
  error.payload = data;
  throw error;
}

function api(path, body) {
  if (path === "/api/attempts") {
    const id = tabData.getItem(attemptKey) || crypto.randomUUID();
    tabData.setItem(attemptKey, id);
    return quizRequest("start", {...body, id});
  }
  const [, id, action = "get"] = path.match(/^\/api\/attempts\/([^/]+)(?:\/([^/]+))?$/);
  return quizRequest(action, {...body, id});
}

function acceptState(data) {
  const next = data.attempt;
  if (attempt?.id === next.id && next.status === "active" && next.resetCount < attempt.resetCount) return;
  timeOffset = next.serverTime - Date.now();
  attempt = next;
  questions = data.questions;
}

function loadPending(id) {
  try {
    return new Set(JSON.parse(tabData.getItem(`kuis-daya.pending.${id}`) || "[]"));
  } catch {
    return new Set();
  }
}

function savePending(id) {
  const key = `kuis-daya.pending.${id}`;
  if (pendingResets.size) tabData.setItem(key, JSON.stringify([...pendingResets]));
  else tabData.removeItem(key);
}

function clearDraft(message) {
  answers = {};
  position = 0;
  if (message) notice = message;
}

function landing(message = "") {
  display(`
    <div class="landing">
      <section class="hero" aria-labelledby="quiz-title">
        <div>
          <p class="eyebrow">D3 Keteknikan Pertanian</p>
          <h1 id="quiz-title">UAS Daya Dalam Bidang Pertanian</h1>
          <p class="subtitle">Kuis pemahaman dan perhitungan energi pada alat pertanian.</p>
          <ul class="topics"><li>Pompa air</li><li>Blower</li><li>Panel surya</li><li>Kincir angin</li></ul>
        </div>
        <dl class="facts">
          <div><dd>25</dd><dt>Soal</dt></div>
          <div><dd>30</dd><dt>Menit</dt></div>
          <div><dd>100</dd><dt>Poin maksimal</dt></div>
        </dl>
      </section>
      <section class="panel identity" aria-labelledby="identity-title">
        <h2 id="identity-title">Identitas peserta</h2>
        <p class="panel-caption">Jika hanya mengetes tautan, cukup pastikan formulir ini tampil. Kode mulai dibagikan dosen saat ujian.</p>
        <form id="start-form" method="post">
          <div class="field">
            <label for="full-name">Nama lengkap</label>
            <input id="full-name" name="fullName" maxlength="100" minlength="2" autocomplete="name" required>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="nim">NIM</label>
              <input id="nim" name="nim" maxlength="25" pattern="[A-Za-z0-9]{3,25}" autocapitalize="characters" required>
            </div>
            <div class="field">
              <label for="group">Golongan</label>
              <select id="group" name="group" required>
                <option value="">Pilih golongan</option><option>A</option><option>B</option><option>C</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="start-code">Kode mulai UAS</label>
            <input id="start-code" name="startCode" type="password" maxlength="100" autocomplete="off" autocapitalize="off" spellcheck="false" required>
          </div>
          <p class="notice">Jika tab tersembunyi atau halaman kehilangan fokus selama 1 detik, jawaban draf terhapus dan kuis dimulai lagi dari soal pertama dengan paket acak baru. Timer tetap berjalan. Penyalinan langsung teks soal dibatasi.</p>
          <p id="start-error" class="error" role="alert" hidden></p>
          <button id="start-button" class="button button-primary" type="submit">Mulai kuis</button>
        </form>
      </section>
    </div>
  `);
  showError("start-error", message);
  document.querySelector("#start-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = document.querySelector("#start-button");
    if (button.disabled) return;
    button.disabled = true;
    button.textContent = "Membuka sesi…";
    showError("start-error", "");
    try {
      await enterAttempt(await api("/api/attempts", Object.fromEntries(new FormData(form))));
    } catch (error) {
      showError("start-error", error.message);
      button.disabled = false;
      button.textContent = "Mulai kuis";
    }
  });
}

async function enterAttempt(data) {
  acceptState(data);
  tabData.setItem(attemptKey, attempt.id);
  pendingResets = loadPending(attempt.id);
  leftPage = false;
  clearDraft(pendingResets.size ? "Jawaban draf telah dikosongkan. Mulai kembali dari soal pertama." : "");
  renderAttempt();
  if (attempt.status !== "active") return;
  if (document.hidden) resetDraft("Tab ujian sempat tersembunyi.");
  else await synchronizeResets();
}

function showClock() {
  if (attempt?.status !== "active") return;
  const left = attempt.deadlineAt - (Date.now() + timeOffset);
  const seconds = Math.max(0, Math.ceil(left / 1000));
  const clock = document.querySelector("#clock-time");
  if (clock) {
    clock.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    clock.parentElement.classList.toggle("is-low", seconds <= 60);
  }
  if (left <= 0 && !submitting) {
    attempt = { ...attempt, status: "expired" };
    clearDraft();
    renderAttempt();
  }
}

function updateProgress() {
  const answered = Object.keys(answers).length;
  document.querySelectorAll(".question-number").forEach((button, index) => {
    const done = Object.hasOwn(answers, questions[index].id);
    button.classList.toggle("is-answered", done);
    button.disabled = submitting;
    button.setAttribute("aria-label", `Soal ${index + 1}, ${done ? "sudah dijawab" : "belum dijawab"}`);
    if (index === position) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
  document.querySelector("#progress-label").textContent = `${answered} dari ${questions.length} dijawab`;
  document.querySelector("#progress").value = answered;
  document.querySelector("#submit-button").disabled = answered !== questions.length || submitting;
  const unanswered = document.querySelector("#unanswered");
  unanswered.hidden = answered === 0 || answered === questions.length;
  unanswered.disabled = submitting;
  document.querySelector("#previous").disabled = position === 0 || submitting;
  document.querySelector("#next").disabled = position === questions.length - 1 || submitting;
}

function goTo(index) {
  if (submitting || index < 0 || index >= questions.length) return;
  position = index;
  renderExam();
  document.querySelector("#question-prompt").focus({ preventScroll: true });
  document.querySelector("#question-panel").scrollIntoView({ block: "nearest" });
}

function renderExam() {
  if (pendingResets.size) {
    display(`
      <section class="panel" aria-label="Paket soal diperbarui">
        <h1>Paket soal diperbarui</h1>
        <p role="status">${escapeHtml(notice)}</p>
        <p>Sisa waktu <time id="clock-time">—</time></p>
        <button type="button" class="button button-primary" id="retry-package">Muat ulang paket</button>
        <p id="package-error" class="error" role="alert" hidden></p>
      </section>
    `);
    document.querySelector("#retry-package").addEventListener("click", () => void synchronizeResets());
    showClock();
    return;
  }
  const question = questions[position];
  const section = question.section === "hitungan" ? "Perhitungan" : "Pemahaman";
  display(`
    <section class="exam-layout" aria-label="Pengerjaan kuis">
      <div class="exam-heading">
        <div>
          <h1 class="page-title">Pengerjaan kuis</h1>
          <p class="identity-caption">${escapeHtml(attempt.fullName)} · ${escapeHtml(attempt.nim)} · Golongan ${escapeHtml(attempt.group)}</p>
        </div>
        <div class="clock"><span>Sisa waktu</span><time id="clock-time">—</time></div>
      </div>
      <p id="exam-notice" class="notice exam-notice" role="status" ${notice ? "" : "hidden"}>${escapeHtml(notice)}</p>
      <article class="panel question" id="question-panel">
        <p class="question-meta">${section} · ${escapeHtml(question.topic)}</p>
        <h2 id="question-prompt" tabindex="-1">${escapeHtml(question.prompt)}</h2>
        <fieldset class="options" aria-labelledby="question-prompt" ${submitting ? "disabled" : ""}>
          ${question.options.map((option, index) => `
            <label class="option">
              <input type="radio" name="answer" value="${index}" ${answers[question.id] === index ? "checked" : ""}>
              <span>${escapeHtml(option)}</span>
            </label>
          `).join("")}
        </fieldset>
        <div class="question-actions">
          <button type="button" class="button button-secondary" id="previous">Sebelumnya</button>
          <button type="button" class="button button-secondary" id="next">Berikutnya</button>
        </div>
      </article>
      <aside class="panel progress-panel" aria-labelledby="progress-title">
        <h2 id="progress-title">Progres</h2>
        <p class="progress-label" id="progress-label"></p>
        <progress id="progress" max="${questions.length}" value="0" aria-label="Jumlah soal yang dijawab"></progress>
        <nav id="question-numbers" class="question-numbers" aria-label="Navigasi nomor soal">
          ${questions.map((item, index) => `<button class="question-number" type="button" data-index="${index}">${index + 1}</button>`).join("")}
        </nav>
        <p class="question-legend"><span><i class="legend-answered" aria-hidden="true"></i>Sudah dijawab</span><span><i class="legend-unanswered" aria-hidden="true"></i>Belum dijawab</span><span><i class="legend-current" aria-hidden="true"></i>Sedang dibuka</span></p>
        <button id="unanswered" class="button button-secondary review-button" type="button">Ke soal belum dijawab</button>
        <button id="submit-button" class="button button-primary submit-button" type="button">${submitting ? "Mengirim…" : "Kirim jawaban"}</button>
        <p id="submit-error" class="error" role="alert" hidden></p>
        <p class="reset-count" id="reset-count">Reset tercatat: ${attempt.resetCount}</p>
      </aside>
    </section>
  `);
  document.querySelector(".options").addEventListener("change", (event) => {
    answers[question.id] = Number(event.target.value);
    showError("submit-error", "");
    updateProgress();
  });
  document.querySelector("#question-numbers").addEventListener("click", (event) => {
    const button = event.target.closest(".question-number");
    if (button) goTo(Number(button.dataset.index));
  });
  document.querySelector("#previous").addEventListener("click", () => goTo(position - 1));
  document.querySelector("#next").addEventListener("click", () => goTo(position + 1));
  document.querySelector("#unanswered").addEventListener("click", () => {
    goTo(questions.findIndex((item) => !Object.hasOwn(answers, item.id)));
  });
  document.querySelector("#submit-button").addEventListener("click", submit);
  updateProgress();
  showClock();
}

function renderAttempt() {
  if (attempt.status === "active") {
    renderExam();
    return;
  }
  const complete = attempt.status === "submitted";
  const result = attempt.result;
  display(`
    <section class="panel result">
      <h1>${complete ? "Jawaban terkirim" : "Waktu pengerjaan habis"}</h1>
      <p class="result-note">${escapeHtml(attempt.fullName)} · ${escapeHtml(attempt.nim)} · Golongan ${escapeHtml(attempt.group)}</p>
      ${complete ? `<p class="score" aria-label="Nilai ${result.score} dari ${result.maxScore}">${result.score}<small>/ ${result.maxScore}</small></p>
        <p class="result-note">${result.correct} dari ${questions.length} jawaban benar</p>
        <p class="result-note">Dikirim ${wib.format(result.submittedAt)} WIB</p>` :
        '<p class="result-note">Sesi ini berakhir sebelum jawaban dikirim.</p>'}
      <div class="result-actions">
        <button class="button button-secondary" id="try-another" type="button">Coba identitas lain</button>
      </div>
    </section>
  `);
  document.querySelector("#try-another").addEventListener("click", () => {
    tabData.removeItem(attemptKey);
    attempt = null;
    notice = "";
    landing();
  });
}

async function synchronizeResets() {
  if (resetSync) return resetSync;
  if (!pendingResets.size || attempt?.status !== "active") return true;
  const id = attempt.id;
  resetSync = (async () => {
    for (const eventId of pendingResets) {
      try {
        const data = await api("/api/attempts/" + id + "/reset", {eventId});
        if (attempt?.id !== id) return false;
        acceptState(data);
        pendingResets.delete(eventId);
        if (attempt.status !== "active") pendingResets.clear();
        savePending(id);
      } catch (error) {
        showError("package-error", error.message);
        return false;
      }
    }
    if (attempt?.id === id) renderAttempt();
    return true;
  })();
  try {
    return await resetSync;
  } finally {
    resetSync = null;
  }
}

function resetDraft(reason) {
  if (leftPage || attempt?.status !== "active") return;
  leftPage = true;
  window.clearTimeout(focusLossTimer);
  focusLostAt = null;
  clearDraft(reason + " Jawaban dikosongkan. Mulai lagi dari soal pertama dengan paket baru.");
  pendingResets.add(crypto.randomUUID());
  savePending(attempt.id);
  if (!submitting) renderExam();
  void synchronizeResets();
}

function resumeExam() {
  if (document.hidden) return;
  if (document.hasFocus()) {
    if (focusLostAt !== null && performance.now() - focusLostAt >= focusGraceMs) {
      resetDraft("Halaman ujian sempat kehilangan fokus.");
    }
    window.clearTimeout(focusLossTimer);
    focusLostAt = null;
    leftPage = false;
  }
  showClock();
  void synchronizeResets();
}

function blockCopy(event) {
  if (attempt?.status !== "active") return;
  event.preventDefault();
  if (!notice) showError("exam-notice", "Penyalinan teks soal dibatasi selama kuis.");
}

async function submit() {
  if (submitting || document.hidden || pendingResets.size || attempt?.status !== "active" ||
    Object.keys(answers).length !== questions.length) return;
  submitting = true;
  renderExam();
  try {
    if (!await synchronizeResets()) throw new Error("Catatan reset belum tersimpan. Periksa koneksi lalu coba lagi.");
    if (attempt.status !== "active") return;
    if (Object.keys(answers).length !== questions.length) {
      throw new Error("Draf telah dikosongkan. Jawab semua soal sebelum mengirim.");
    }
    const data = await api(`/api/attempts/${attempt.id}/submit`, {
      answers, resetCount: attempt.resetCount,
    });
    acceptState(data);
    clearDraft();
    renderAttempt();
  } catch (error) {
    if (error.payload?.attempt) acceptState(error.payload);
    if (error.status === 409) clearDraft(error.message);
    submitting = false;
    renderAttempt();
    if (attempt.status === "active" && error.status !== 409) showError("submit-error", error.message);
  } finally {
    submitting = false;
  }
}

function formatTime(value) {
  return value == null ? "—" : `${wib.format(value)} WIB`;
}

function renderRecap() {
  display(`
    <header class="recap-header">
      <div><h1>Rekap dosen</h1><p>UAS Daya Dalam Bidang Pertanian</p></div>
      <button class="button button-primary" id="export" type="button" disabled>Unduh CSV untuk Excel</button>
    </header>
    <form id="recap-login" class="panel identity" aria-label="Buka rekap dosen">
      <div class="field"><label for="recap-code">Kode rekap dosen</label>
      <input id="recap-code" type="password" autocomplete="off" maxlength="100" required></div>
      <button class="button button-primary" type="submit">Buka rekap</button>
      <p id="recap-login-error" class="error" role="alert" hidden></p>
    </form>
    <div id="recap-content" hidden>
    <dl class="metrics">
      <div class="metric"><dt>Pengiriman</dt><dd id="count">—</dd></div>
      <div class="metric"><dt>Rata-rata</dt><dd id="average">—</dd></div>
      <div class="metric"><dt>Nilai tertinggi</dt><dd id="highest">—</dd></div>
    </dl>
    <section class="panel" aria-label="Daftar nilai">
      <div class="recap-toolbar">
        <div class="field">
          <label for="recap-group">Golongan</label>
          <select id="recap-group"><option value="">Semua golongan</option><option>A</option><option>B</option><option>C</option></select>
        </div>
        <button id="refresh-recap" class="button button-secondary" type="button">Muat ulang</button>
      </div>
      <p id="recap-error" class="error" role="alert" hidden></p>
      <p id="recap-empty" class="empty" role="status">Memuat hasil…</p>
      <div id="recap-table" class="table-wrap" tabindex="0" aria-label="Tabel nilai peserta" hidden>
        <table>
          <thead><tr><th scope="col">Nama</th><th scope="col">NIM</th><th scope="col">Golongan</th><th scope="col">Benar</th><th scope="col">Nilai</th><th scope="col">Dikirim</th><th scope="col">Reset</th><th scope="col">Reset terakhir</th><th scope="col">Aksi</th></tr></thead>
          <tbody id="recap-rows"></tbody>
        </table>
      </div>
    </section>
    </div>
  `);

  let latest = 0;
  let code = "";
  let loadedRows = [];
  let deleting = false;
  const login = document.querySelector("#recap-login");
  const content = document.querySelector("#recap-content");
  const exportButton = document.querySelector("#export");
  const group = document.querySelector("#recap-group");
  const empty = document.querySelector("#recap-empty");
  const table = document.querySelector("#recap-table");
  async function refresh() {
    if (deleting) return;
    const request = ++latest;
    if (!code) return;
    exportButton.disabled = true;
    showError("recap-error", "");
    try {
      const { results } = await quizRequest("recap", {code, group: group.value});
      if (request !== latest) return;
      loadedRows = results;
      login.hidden = true;
      content.hidden = false;
      exportButton.disabled = results.length === 0;
      const scores = results.map((row) => row.score);
      const decimal = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });
      document.querySelector("#count").textContent = scores.length;
      document.querySelector("#average").textContent = scores.length
        ? decimal.format(scores.reduce((sum, score) => sum + score, 0) / scores.length) : "—";
      document.querySelector("#highest").textContent = scores.length ? Math.max(...scores) : "—";
      document.querySelector("#recap-rows").innerHTML = results.map((row) => `<tr>
        <td>${escapeHtml(row.full_name)}</td><td>${escapeHtml(row.nim)}</td><td>${escapeHtml(row.group_name)}</td>
        <td>${row.correct_count}/25</td><td>${row.score}</td><td>${formatTime(row.submitted_at)}</td>
        <td>${row.reset_count}</td><td>${formatTime(row.last_reset_at)}</td>
        <td><button class="button button-delete" type="button" data-delete-id="${escapeHtml(row.id)}" aria-label="Hapus data ${escapeHtml(row.full_name)}, NIM ${escapeHtml(row.nim)}">Hapus</button></td>
      </tr>`).join("");
      table.hidden = !results.length;
      empty.hidden = !!results.length;
      empty.textContent = "Belum ada jawaban yang berhasil dikirim pada golongan ini.";
    } catch (error) {
      if (request !== latest) return;
      empty.hidden = true;
      if (error.status === 403) {
        code = "";
        loadedRows = [];
        login.hidden = false;
        content.hidden = true;
      }
      showError(login.hidden ? "recap-error" : "recap-login-error", error.message);
    }
  }
  document.querySelector("#recap-rows").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete-id]");
    if (!button || deleting) return;
    const row = loadedRows.find(item => item.id === button.dataset.deleteId);
    if (!row) return;
    if (!window.confirm(`Hapus data ${row.full_name} (NIM ${row.nim}, Golongan ${row.group_name})?\n\nNilai, jawaban, sesi, dan catatan reset peserta ini akan dihapus permanen. Data akan hilang dari rekap dan CSV.`)) return;
    deleting = true;
    ++latest;
    group.disabled = true;
    exportButton.disabled = true;
    const refreshButton = document.querySelector("#refresh-recap");
    refreshButton.disabled = true;
    document.querySelectorAll("[data-delete-id]").forEach(item => { item.disabled = true; });
    button.textContent = "Menghapus…";
    showError("recap-error", "");
    let removed = false;
    try {
      await quizRequest("delete", {id:row.id, code});
      removed = true;
    } catch (error) {
      showError("recap-error", error.message);
    } finally {
      deleting = false;
      group.disabled = false;
      refreshButton.disabled = false;
      exportButton.disabled = loadedRows.length === 0;
      document.querySelectorAll("[data-delete-id]").forEach(item => { item.disabled = false; });
      button.textContent = "Hapus";
    }
    if (removed) {
      // Jangan biarkan nilai lama tetap dapat diekspor jika refresh gagal.
      loadedRows = loadedRows.filter(item => item.id !== row.id);
      button.closest("tr").remove();
      exportButton.disabled = true;
      await refresh();
    }
  });
  group.addEventListener("change", refresh);
  document.querySelector("#refresh-recap").addEventListener("click", refresh);
  exportButton.addEventListener("click", () => void downloadRecap(code, group.value));
  login.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#recap-code");
    code = input.value.trim();
    input.value = "";
    showError("recap-login-error", "");
    void refresh();
  });
}

async function restoreAttempt(id) {
  try {
    await enterAttempt(await api(`/api/attempts/${id}`));
  } catch (error) {
    if (error.status === 404) tabData.removeItem(attemptKey);
    landing(error.message);
  }
}

if (isRecap) {
  renderRecap();
} else {
  const id = tabData.getItem(attemptKey);
  if (id) void restoreAttempt(id);
  else landing();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetDraft("Tab ujian sempat tersembunyi.");
    else resumeExam();
  });
  window.addEventListener("blur", () => {
    if (attempt?.status !== "active" || leftPage || focusLostAt !== null) return;
    focusLostAt = performance.now();
    focusLossTimer = window.setTimeout(() => {
      if (!document.hasFocus()) resetDraft("Halaman ujian sempat kehilangan fokus.");
    }, focusGraceMs);
  });
  window.addEventListener("focus", resumeExam);
  window.addEventListener("pagehide", () => resetDraft("Halaman ujian sempat ditinggalkan."));
  window.addEventListener("pageshow", resumeExam);
  document.addEventListener("copy", blockCopy, true);
  document.addEventListener("cut", blockCopy, true);
  window.setInterval(showClock, 400);
}

async function downloadRecap(code, group) {
  try {
    const response = await fetch('/api/recap.csv',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,group})});
    if (!response.ok) throw new Error((await response.json()).error);
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = url; link.download = 'Rekap_UAS_Daya_Pertanian.csv'; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url),1000);
  } catch (error) { showError('recap-error',error.message); }
}

