import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  Button,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";

const Crud = () => {
  type Catatan = {
    id: number;
    nama: string;
    catatanku: string;
    tanggal: string;
  };

  const [nama, setNama] = useState("");
  const [catatan, setCatatan] = useState("");
  const [data, setData] = useState<Catatan[]>([]);
  const [selectedItem, setSelectedItem] = useState<Catatan | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (item: Catatan): void => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const buttonHandle = () => {
    if (nama === "" || catatan === "") {
      Alert.alert("Error", "Form harus diisi dengan lengkap!");
      return;
    }

    axios
      .post("http://192.168.110.4/ppb_rpl1/add.php", { nama, catatan })
      .then((response) => {
        Alert.alert("SUKSES", response.data.message);
        setNama("");
        setCatatan("");
        fetchData();
      })
      .catch((error) => {
        Alert.alert("Error");
      });
  };

  const fetchData = () => {
    axios
      .get("http://192.168.110.4/ppb_rpl1/get.php")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setData([]);
        }
      })
      .catch(() => {
        Alert.alert("Error", "Gagal mengambil data dari db");
      });
  };

  const handleUpdate = () => {
    if (selectedItem) {
      axios
      .post('http://192.168.110.4/ppb_rpl1/update.php', {
        id: selectedItem.id,
        nama: selectedItem.nama,
        catatan: selectedItem.catatanku
      })
      .then(() => {
        Alert.alert('SUKSES', 'Data berhasil diperbaharui!')
        closeModal()
        fetchData()
      })
      .catch(() => {
        Alert.alert('ERROR', 'Data gagal diperbaharui!')
      })
    }
  }

  const handleDelete = (id: number) => {
    Alert.alert('KONFIRMASI', 'Apakah anda yakin akan menghapus catatan ini?', [
      {
        text: 'Batal',
        style: 'cancel'
      },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          axios
          .post('http://192.168.110.4/ppb_rpl1/delete.php', {id})
          .then(() => {
            Alert.alert('Data berhasil dihapus!')
            fetchData()
          })
          .catch(() => {
            Alert.alert('ERROR', 'Catatan gagal dihapus!')
          })
        }
      }
    ])
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      <TextInput
        style={styles.inputNama}
        placeholder="namaku"
        value={nama}
        onChangeText={setNama}
      />
      <TextInput
        style={styles.inputCatatan}
        placeholder="catatanku"
        value={catatan}
        onChangeText={setCatatan}
        multiline={true}
      />

      <TouchableOpacity style={styles.btn_simpan} onPress={buttonHandle}>
        <Text>SIMPAN</Text>
      </TouchableOpacity>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.card}>
              <Text>nama: {item.nama}</Text>
              <Text>{item.catatanku}</Text>
              <Text>{item.tanggal}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text>Hapus</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <TextInput 
                style={styles.inputNama}
                value={selectedItem.nama}
                onChangeText={(text) =>
                  setSelectedItem({...selectedItem, nama: text})
                }
                />
                <TextInput 
                style={styles.inputCatatan}
                value={selectedItem.catatanku}
                onChangeText={(text) => 
                  setSelectedItem({...selectedItem, catatanku:text})
                }
                />
                <Button title='UPDATE' onPress={handleUpdate} />
              </>
            )}

            <TouchableOpacity onPress={closeModal} style={styles.iconClose}>
              <Text style={{ fontSize: 20 }}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Crud;

const styles = StyleSheet.create({
  inputNama: {
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 50,
    marginTop: 50,
  },
  inputCatatan: {
    height: 200,
    borderWidth: 1,
    marginHorizontal: 50,
    borderRadius: 5,
    marginTop: 15,
    textAlignVertical: "top",
  },
  btn_simpan: {
    backgroundColor: "limegreen",
    width: 70,
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 5,
  },
  card: {
    backgroundColor: "#f5f5f5",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(192, 192, 192, 0.66)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 10,
    width: "80%",
    borderRadius: 10,
  },

  iconClose: {
    position: "absolute",
    right: 10,
  },
});
