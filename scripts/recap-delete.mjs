export function addRecapDelete(js) {
  js = js.replace('<th scope="col">Reset terakhir</th></tr>', '<th scope="col">Reset terakhir</th><th scope="col">Aksi</th></tr>');
  js = js.replace('  let loadedRows = [];', '  let loadedRows = [];\n  let deleting = false;');
  js = js.replace('  async function refresh() {\n    const request', '  async function refresh() {\n    if (deleting) return;\n    const request');
  js = js.replace('        <td>${row.reset_count}</td><td>${formatTime(row.last_reset_at)}</td>', `        <td>\${row.reset_count}</td><td>\${formatTime(row.last_reset_at)}</td>
        <td><button class="button button-delete" type="button" data-delete-id="\${escapeHtml(row.id)}" aria-label="Hapus data \${escapeHtml(row.full_name)}, NIM \${escapeHtml(row.nim)}">Hapus</button></td>`);
  js = js.replace('  group.addEventListener("change", refresh);', `  document.querySelector("#recap-rows").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete-id]");
    if (!button || deleting) return;
    const row = loadedRows.find(item => item.id === button.dataset.deleteId);
    if (!row) return;
    if (!window.confirm(\`Hapus data \${row.full_name} (NIM \${row.nim}, Golongan \${row.group_name})?\\n\\nNilai, jawaban, sesi, dan catatan reset peserta ini akan dihapus permanen. Data akan hilang dari rekap dan CSV.\`)) return;
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
  group.addEventListener("change", refresh);`);
  return js;
}
