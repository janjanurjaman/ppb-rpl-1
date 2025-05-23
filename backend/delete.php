<?php
    include './koneksi.php';
    $data = json_decode(file_get_contents('php://input'));

    if (isset($data->id)) {
        $id = $data->id;

        $sql = "DELETE FROM catatan WHERE id = $id";

        if ($konek->query($sql) === TRUE) {
            echo json_encode('Catatan berhasil dihapus');
        } else {
            echo json_encode('Catatan gagal dihapus');
        }
    } else {
        echo json_encode('ID tidak ditemukan');
    }
?>