const fs = require("fs");
const path = "app/pembayaran/checkout-form.tsx";
const lines = fs.readFileSync(path, "utf8").split("\n");

// Baris 177 (index 176) = <Field label="Metode Pembayaran"...>
// Cari awal blok: baris yang mengandung 'label="Metode Pembayaran"'
const startIdx = lines.findIndex((l) => l.includes('label="Metode Pembayaran"'));
// Cari akhir blok metode lama: baris sebelum '<div className="mt-2 flex items-center justify-between gap-3">'
// (blok tombol Kembali/Selesaikan) — cari baris itu, lalu mundur ke penutup ')}'
const btnIdx = lines.findIndex((l) => l.includes('className="mt-2 flex items-center justify-between gap-3"'));
// mundur: cari ')}' sebelum btnIdx
let endIdx = -1;
for (let i = btnIdx - 1; i >= 0; i--) {
  if (lines[i].trim() === ")}") { endIdx = i; break; }
}
console.log("start:", startIdx + 1, "end:", endIdx + 1);

const newBlock = `              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <p className="text-[13px] text-fg-muted">Total yang harus dibayar</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
                  {formatRupiah(totalBayar)}
                </p>
                <p className="mt-2 text-[13px] leading-5 text-fg-muted">
                  <span className="font-medium text-fg">Kode unik ${"{"}uniqueCode${"}"}</span> sudah termasuk di
                  nominal di atas — bayar persis sejumlah itu agar pesanan mudah dikenali.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 py-2">
                <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-3 shadow-sm">
                  <img
                    src="/qris.png"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                    }}
                    alt="Kode QRIS Tokono — pindai dengan aplikasi e-wallet atau m-banking"
                    className="h-52 w-52 object-contain"
                  />
                </div>
                <p className="max-w-xs text-center text-[13px] leading-5 text-fg-muted">
                  Pindai QRIS di atas, bayar sesuai nominal{" "}
                  <span className="font-medium text-fg">{formatRupiah(totalBayar)}</span>, lalu tekan tombol di
                  bawah.
                </p>
                {qrisDone ? (
                  <p className="flex items-center gap-1.5 text-[13px] font-medium text-success">
                    <CheckCircle2 size={14} /> Pembayaran Anda tercatat.
                  </p>
                ) : (
                  <Button className="w-full" onClick={() => setQrisDone(true)}>
                    Saya Sudah Bayar
                  </Button>
                )}
              </div>`;

const result = [
  ...lines.slice(0, startIdx),
  newBlock,
  ...lines.slice(endIdx),
];
fs.writeFileSync(path, result.join("\n"));
console.log("done");
