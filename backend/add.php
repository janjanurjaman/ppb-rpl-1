<?php
    include './koneksi.php';
    $data = json_decode(file_get_contents('php://input'));

    if (isset($data->nama) && isset($data->catatan)) {
        $nama = $data->nama;
        $catatan = $data->catatan;

        $sql = "INSERT INTO catatan (nama, catatanku) VALUES ('$nama', '$catatan')";

        if ($konek->query($sql) === TRUE) {
            echo json_encode(["message" => "Data Tersimpan"]);
        } else {
            echo json_encode(["message" => "Data Tidak Tersimpan"]);
        }
    } else {
        echo json_encode(["message" => "Data Tidak Lengkap"]);
    }
?>