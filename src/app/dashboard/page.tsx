"use client";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Navbar from '@/components/Navbar';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import AddDataModal from '@/components/AddDataModal';
import EditDataModal from '@/components/EditDataModal';
import Skeleton from '@mui/material/Skeleton';
import toast from 'react-hot-toast';

interface Column {
  id: 'name' | 'age' | 'dob' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'age', label: 'Age', minWidth: 150, align: 'center' },
  { id: 'dob', label: 'DOB', minWidth: 150, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 150, align: 'center' },
];

interface Data {
  _id: string;
  name: string;
  dob: string;
  age?: number;
}

function formatDate(dob: string): string {
  const [year, month, day] = dob.split("T")[0].split("-");
  return `${day}-${month}-${year}`;
}

function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function createData(_id: string, name: string, dob: string): Data {
  const age = calculateAge(dob);
  dob = formatDate(dob);
  return { _id, name, dob, age };
}

function formatToInputDate(dob: string): string {
  const [day, month, year] = dob.split('-');
  return `${year}-${month}-${day}`;
}

const DashboardPage = () => {
  const [rows, setRows] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [deleteLoadingRowId, setDeleteLoadingRowId] = useState<string | null>(null);
  const [openAddDatamodal, setOpenAddDataModal] = useState<boolean>(false);
  const [openEditDatamodal, setOpenEditDataModal] = useState<boolean>(false);

  const [editData, setEditData] = useState<Data>({
    _id: '',
    name: '',
    dob: '',
  });

  const openAddModal = () => setOpenAddDataModal(true);
  const closeAddModal = () => setOpenAddDataModal(false);
  const openEditModal = () => setOpenEditDataModal(true);
  const closeEditModal = () => setOpenEditDataModal(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); 
        const response = await axios.get('/api/data');
        const fetchedData = response.data.data.map((item: Data) =>
          createData(item._id, item.name, item.dob)
        );
        setRows(fetchedData);
      }catch (error: unknown) {
        // console.log("Fetch failed", error);
        toast.error("Fetch failed");

        if (error instanceof AxiosError && error.response?.data?.error) {
          // console.log(error.response.data.error);
          toast.error(error.response.data.error);
        } else if (error instanceof Error) {
          // console.log(error.message || "Something went wrong. Please try again.");
          toast.error(error.message || "Something went wrong. Please try again.");
        } else {
          // console.log("An unknown error occurred.");
          toast.error("An unknown error occurred.");
        }
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleteLoadingRowId(id);
    try {
      await axios.delete(`/api/data?id=${id}`);
      setRows((prevRows) => prevRows.filter((row) => row._id !== id));
      toast.success('Successfully Deleted!');
    }catch (error: unknown) {
      // console.log("Delete failed", error);
      toast.error("Delete failed");

      if (error instanceof AxiosError && error.response?.data?.error) {
        // console.log(error.response.data.error);
        toast.error(error.response.data.error);
      } else if (error instanceof Error) {
        // console.log(error.message || "Something went wrong. Please try again.");
        toast.error(error.message || "Something went wrong. Please try again.");
      } else {
        // console.log("An unknown error occurred.");
        toast.error("An unknown error occurred.");
      }
    } finally {
      setDeleteLoadingRowId(null);
    }
  };

    const handleEdit = (id: string) => {
    const rowToEdit = rows.find((row) => row._id === id);
    if (rowToEdit) {
      setEditData({
        ...rowToEdit,
        dob:formatToInputDate(rowToEdit.dob)
      });
      openEditModal();
    }
  };

  const handleAddupdate = async (data: Data) => {
    if (!data) {
      console.error('Invalid data. Cannot add to rows.');
      return;
    }
    setRows((prevRows) => [...prevRows, createData(data._id, data.name, data.dob)]);
    toast.success('Data Added Successfully !');

  };

  const handleEditUpdate = async (data: Data) => {
    if (!data) {
      console.error('Invalid data. Cannot add or update rows.');
      return;
    }
    setRows((prevRows) => {
      const index = prevRows.findIndex((row) => row._id === data._id);
      if (index !== -1) {
        const updatedRows = [...prevRows];
        updatedRows[index] = createData(data._id, data.name, data.dob);
        return updatedRows;
      }
      return [...prevRows, data];
    });
    toast.success('Data Edited Successfully!');
  };

  return (
    <div className='bg-slate-100 h-screen'>
      <Navbar />
      <div className="w-full">
        <button
          type="button"
          className="ml-1 mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={openAddModal}
        >
          Add Data
        </button>
      </div>
      <Paper sx={{ width: '100%', height: '84%', overflow: 'hidden'  }}>
        <TableContainer sx={{ maxHeight: 540 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: rowsPerPage }).map((_, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          <Skeleton animation="wave" variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                        {columns.map((column) => {
                          if (column.id === 'actions') {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  onClick={() => handleEdit(row._id)}
                                  sx={{ marginRight: 1 }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  onClick={() => handleDelete(row._id)}
                                  disabled={deleteLoadingRowId === row._id}
                                  loading={deleteLoadingRowId === row._id}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            );
                          } else {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value}
                              </TableCell>
                            );
                          }
                        })}
                      </TableRow>
                    ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 40, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
        />
      </Paper>
      <AddDataModal
        isOpen={openAddDatamodal}
        onClose={closeAddModal}
        handleUpdate={handleAddupdate}
      />
      <EditDataModal
        isOpen={openEditDatamodal}
        onClose={closeEditModal}
        handleEditUpdate={handleEditUpdate}
        existingData={editData}
      />

    </div>
  );
};

export default DashboardPage;
