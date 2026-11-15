// Adaptasi antarmuka dipakai juga saat aset Sites diekstrak ulang.
export function addProgressNavigation(js) {
  js = js.replace('  const answered = Object.keys(answers).length;', `  const answered = Object.keys(answers).length;
  document.querySelectorAll(".question-number").forEach((button, index) => {
    const done = Object.hasOwn(answers, questions[index].id);
    button.classList.toggle("is-answered", done);
    button.disabled = submitting;
    button.setAttribute("aria-label", \`Soal \${index + 1}, \${done ? "sudah dijawab" : "belum dijawab"}\`);
    if (index === position) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });`);
  js = js.replace('        <button id="unanswered"', `        <nav id="question-numbers" class="question-numbers" aria-label="Navigasi nomor soal">
          \${questions.map((item, index) => \`<button class="question-number" type="button" data-index="\${index}">\${index + 1}</button>\`).join("")}
        </nav>
        <p class="question-legend"><span><i class="legend-answered" aria-hidden="true"></i>Sudah dijawab</span><span><i class="legend-unanswered" aria-hidden="true"></i>Belum dijawab</span><span><i class="legend-current" aria-hidden="true"></i>Sedang dibuka</span></p>
        <button id="unanswered"`);
  js = js.replace('  document.querySelector("#previous").addEventListener', `  document.querySelector("#question-numbers").addEventListener("click", (event) => {
    const button = event.target.closest(".question-number");
    if (button) goTo(Number(button.dataset.index));
  });
  document.querySelector("#previous").addEventListener`);
  return js;
}
