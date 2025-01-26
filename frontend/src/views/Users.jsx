import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable, {createTheme} from "react-data-table-component";
import axiosClient from "../axios-client";

const CustomLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <div className="spinner"></div>
  </div>
);

createTheme('modernClean', {
  text: {
    primary: '#4a4a4a', // Warna teks utama
    secondary: '#6c757d', // Warna teks sekunder
  },
  background: {
    default: '#f8f9fa', // Warna latar belakang tabel
  },
  context: {
    background: '#007bff', // Warna konteks (misalnya, saat dipilih)
    text: '#ffffff', // Warna teks konteks
  },
  divider: {
    default: '#dee2e6', // Warna garis pembatas
  },
  button: {
    default: '#007bff', // Warna tombol default
    focus: '#0056b3', // Warna tombol saat fokus
    hover: '#0056b3', // Warna tombol saat hover
    disabled: 'rgba(0,0,0,.12)', // Warna tombol saat dinonaktifkan
  },
  sortFocus: {
    default: '#6c757d', // Warna ikon sort
  },
  selected: {
    default: '#e9ecef', // Warna baris yang dipilih
    text: '#343a40', // Warna teks pada baris yang dipilih
  },
  action: {
    button: '#6c757d', // Warna aksi (tombol, teks interaktif)
    hover: '#495057', // Warna hover
    disabled: '#adb5bd', // Warna tombol/aksi saat dinonaktifkan
  },
});

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchUsers = (page, size = pageSize) => {
    setLoading(true);
    axiosClient
      .get('/users', { params: { page, pageSize: size } })
      .then(({ data }) => {
        setUsers(data.data); // Data pengguna pada halaman ini
        setTotalRows(data.total); // Total jumlah pengguna dari server
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize); // Perbarui ukuran halaman
    setCurrentPage(1); // Reset ke halaman pertama
    fetchUsers(1, newPageSize); // Muat ulang data dengan page size baru
  };

  const onDelete = (user) => {
    if (!window.confirm(`Yakin mau menghapus ${user.name}?`)) {
      return;
    }

    axiosClient.delete(`/users/${user.id}`).then(() => {
      fetchUsers(currentPage, pageSize);
    });
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Created At", selector: (row) => row.created_at, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Link to={`/users/${row.id}`} className="btn-edit">Edit</Link>
          &nbsp;
          <button onClick={() => onDelete(row)} className="btn-delete">Delete</button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Users</h1>
      <Link to="/users/new" className="btn-add">Add New</Link>
      <DataTable
        columns={columns}
        data={users}
        progressPending={loading}
        progressComponent={<CustomLoader/>}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={(page) => setCurrentPage(page)}
        paginationPerPage={pageSize}
        onChangeRowsPerPage={(newPageSize) => handlePageSizeChange(newPageSize)}
        theme="modernClean"
      />
    </div>
  );
}

