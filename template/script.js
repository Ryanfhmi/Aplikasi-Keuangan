// Inisialisasi Data
let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
let editIndex = null;

// Seleksi Elemen DOM
let deskripsiInput = document.getElementById("deskripsi");
let hargaInput = document.getElementById("harga");
let jumlahInput = document.getElementById("jumlah");
let tipeInput = document.getElementById("tipe");
let kategoriInput = document.getElementById("kategori");
let daftarTransaksi = document.getElementById("daftarTransaksi");
let awalInput = document.getElementById("awal");
let persenInput = document.getElementById("persen");
let hasilKalkulator = document.getElementById("hasilKalkulator");
let tambahTransaksiButton = document.getElementById("tambahTransaksi");
let updateTransaksiButton = document.getElementById("updateTransaksi");

// Fungsi untuk Menampilkan Transaksi
function tampilkanTransaksi() {
  daftarTransaksi.innerHTML = "";
  transaksi.forEach((item, index) => {
    let row = document.createElement("tr");
    let total = item.harga * item.jumlah;

    row.innerHTML = `
      <td>${item.deskripsi}</td>
      <td>${item.harga}</td>
      <td>${item.jumlah}</td>
      <td>${total}</td>
      <td>${item.tipe === "income" ? "Pemasukan" : "Pengeluaran"}</td>
      <td>${item.kategori}</td>
      <td>
        <button onclick="editTransaksi(${index})">Edit</button>
        <button onclick="hapusTransaksi(${index})">Hapus</button>
      </td>
    `;
    daftarTransaksi.appendChild(row);
  });
}

// Fungsi untuk Menambah Transaksi
function tambahTransaksi() {
  let deskripsi = deskripsiInput.value;
  let harga = parseFloat(hargaInput.value);
  let jumlah = parseFloat(jumlahInput.value);
  let tipe = tipeInput.value;
  let kategori = kategoriInput.value;

  if (deskripsi === "" || isNaN(harga) || harga <= 0 || isNaN(jumlah) || jumlah <= 0) {
    alert("Harap isi semua field dengan benar!");
    return;
  }

  transaksi.push({ deskripsi, harga, jumlah, tipe, kategori });
  deskripsiInput.value = "";
  hargaInput.value = "";
  jumlahInput.value = "";

  localStorage.setItem("transaksi", JSON.stringify(transaksi));
  tampilkanTransaksi();
}

// Fungsi untuk Menghapus Transaksi
function hapusTransaksi(index) {
  transaksi.splice(index, 1);
  localStorage.setItem("transaksi", JSON.stringify(transaksi));
  tampilkanTransaksi();
}

// Fungsi untuk Edit Transaksi
function editTransaksi(index) {
  editIndex = index;
  let item = transaksi[index];

  deskripsiInput.value = item.deskripsi;
  hargaInput.value = item.harga;
  jumlahInput.value = item.jumlah;
  tipeInput.value = item.tipe;
  kategoriInput.value = item.kategori;

  tambahTransaksiButton.style.display = "none";
  updateTransaksiButton.style.display = "inline";
}

// Fungsi untuk Memperbarui Transaksi
function perbaruiTransaksi() {
  let deskripsi = deskripsiInput.value;
  let harga = parseFloat(hargaInput.value);
  let jumlah = parseFloat(jumlahInput.value);
  let tipe = tipeInput.value;
  let kategori = kategoriInput.value;

  if (deskripsi === "" || isNaN(harga) || harga <= 0 || isNaN(jumlah) || jumlah <= 0) {
    alert("Harap isi semua field dengan benar!");
    return;
  }

  transaksi[editIndex] = { deskripsi, harga, jumlah, tipe, kategori };
  localStorage.setItem("transaksi", JSON.stringify(transaksi));

  deskripsiInput.value = "";
  hargaInput.value = "";
  jumlahInput.value = "";
  tambahTransaksiButton.style.display = "inline";
  updateTransaksiButton.style.display = "none";

  tampilkanTransaksi();
}

// Fungsi untuk Membuat PDF dengan Tabel
function unduhPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Header tabel
  const header = [["Deskripsi", "Harga", "Jumlah", "Total", "Tipe", "Kategori"]];

  // Data tabel
  const data = transaksi.map(item => [
    item.deskripsi,
    item.harga,
    item.jumlah,
    item.harga * item.jumlah,
    item.tipe === "income" ? "Pemasukan" : "Pengeluaran",
    item.kategori
  ]);

  // Tambahkan tabel ke PDF
  doc.text("Laporan Keuangan", 10, 10);
  doc.autoTable({
    head: header,
    body: data,
    startY: 20
  });

  // Tambahkan hasil kalkulator
  const hasilKalk = parseFloat(hasilKalkulator.innerText) || 0;
  doc.text(`Hasil Kalkulator: ${hasilKalk}`, 10, doc.lastAutoTable.finalY + 10);

  doc.save("laporan-keuangan.pdf");
}

// Fungsi Kalkulator Keuangan
function hitungKalkulator() {
  let jumlahAwal = parseFloat(awalInput.value);
  let persen = parseFloat(persenInput.value);

  if (isNaN(jumlahAwal) || isNaN(persen)) {
    alert("Masukkan angka yang valid!");
    return;
  }

  let hasil = jumlahAwal + (jumlahAwal * persen / 100); 
  hasilKalkulator.innerText = hasil.toFixed(2);
}

// Event Listener
tambahTransaksiButton.addEventListener("click", tambahTransaksi);
updateTransaksiButton.addEventListener("click", perbaruiTransaksi);
document.getElementById("downloadPDF").addEventListener("click", unduhPDF);
document.getElementById("hitung").addEventListener("click", hitungKalkulator);

// Tampilkan Transaksi Saat Halaman Dimuat
tampilkanTransaksi();