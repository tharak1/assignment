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

// const DashboardPage = () => {
//   const [rows, setRows] = useState<Data[]>([]);
//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [rowsPerPage, setRowsPerPage] = useState(20);
//   const [deleteLoadingRowId, setDeleteLoadingRowId] = useState<string | null>(null); // Track specific row for delete loading
//   const [openAddDatamodal, setOpenAddDataModal] = useState<boolean>(false);
//   const [openEditDatamodal, setOpenEditDataModal] = useState<boolean>(false);

//   const [editData, setEditData] = useState<Data>({
//     _id: '',
//     name: '',
//     dob: '',
//   });

//   const openAddModal = () => {
//     setOpenAddDataModal(true);
//   };

//   const closeAddModal = () => {
//     setOpenAddDataModal(false);
//   };

//   const openEditModal = () => {
//     setOpenEditDataModal(true);
//   }

//   const closeEditModal = () => {
//     setOpenEditDataModal(false);
//   }

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get('/api/data');
//       const fetchedData = response.data.data.map((item: any) => createData(item._id, item.name, item.dob));
//       setRows(fetchedData);
//     } catch (error: unknown) {
//       console.log("Login failed", error);
//       if (error instanceof AxiosError && error.response?.data?.error) {
//           console.log(error.response.data.error);
//       } else if (error instanceof Error) {
//         console.log(error.message || "Something went wrong. Please try again.");
//       } else {
//         console.log("An unknown error occurred.");
//       }
//     }finally{
//       setLoading(false);
//     }
//   };

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };



//   const handleEdit = (id: string) => {
//     const rowToEdit = rows.find((row) => row._id === id);
//     if (rowToEdit) {
//       setEditData({
//         ...rowToEdit,
//         dob:formatToInputDate(rowToEdit.dob)
//       });
//       openEditModal();
//     }
//   };

//   const handleDelete = async (id: string) => {
//     setDeleteLoadingRowId(id);
//     try {
//       await axios.delete(`/api/data?id=${id}`);
//       setRows((prevRows) => prevRows.filter((row) => row._id !== id));
//     } catch (error) {
//       console.error('Error deleting data:', error);
//     } finally {
//       setDeleteLoadingRowId(null);
//     }
//   };

//   const handleAddupdate = async (data: Data) => {
//     if (!data) {
//       console.error('Invalid data. Cannot add to rows.');
//       return;
//     }
//     setRows((prevRows) => [...prevRows, createData(data._id, data.name, data.dob)]);
//   };

//   const handleEditUpdate = async (data: Data) => {
//     if (!data) {
//       console.error('Invalid data. Cannot add or update rows.');
//       return;
//     }
//     setRows((prevRows) => {
//       const index = prevRows.findIndex((row) => row._id === data._id);
//       if (index !== -1) {
//         const updatedRows = [...prevRows];
//         updatedRows[index] = createData(data._id, data.name, data.dob);
//         return updatedRows;
//       }
//       return [...prevRows, data];
//     });
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="w-full">
//         <button
//           type="button"
//           className="ml-1 mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
//           onClick={openAddModal}
//         >
//           Add Data
//         </button>
//       </div>
//       <Paper sx={{ width: '100%', height:'70%', overflow: 'hidden'}}>
//         <TableContainer sx={{ maxHeight: 540 }}>
//           <Table stickyHeader aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 {columns.map((column) => (
//                   <TableCell
//                     key={column.id}
//                     align={column.align}
//                     style={{ minWidth: column.minWidth }}
//                   >
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {rows
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row) => {
//                   return (
//                     <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
//                       {columns.map((column) => {
//                         if (column.id === 'actions') {
//                           return (
//                             <TableCell key={column.id} align={column.align}>
//                               <Button
//                                 variant="outlined"
//                                 color="primary"
//                                 size="small"
//                                 onClick={() => handleEdit(row._id)}
//                                 sx={{ marginRight: 1 }}
//                               >
//                                 Edit
//                               </Button>
//                               <Button
//                                 variant="outlined"
//                                 color="secondary"
//                                 size="small"
//                                 onClick={() => handleDelete(row._id)}
//                                 disabled={deleteLoadingRowId === row._id} // Disable button when loading
//                               >
//                                 {deleteLoadingRowId === row._id ? (
//                                   <div role="status">
//                                     <svg
//                                       aria-hidden="true"
//                                       className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
//                                       viewBox="0 0 100 101"
//                                       fill="none"
//                                       xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                       <path
//                                         d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//                                         fill="currentColor"
//                                       />
//                                       <path
//                                         d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//                                         fill="currentFill"
//                                       />
//                                     </svg>
//                                     <span className="sr-only">Loading...</span>
//                                   </div>
//                                 ) : (
//                                   'Delete'
//                                 )}
//                               </Button>
//                             </TableCell>
//                           );
//                         } else {
//                           const value = row[column.id];
//                           return (
//                             <TableCell key={column.id} align={column.align}>
//                               {column.format && typeof value === 'number'
//                                 ? column.format(value)
//                                 : value}
//                             </TableCell>
//                           );
//                         }
//                       })}
//                     </TableRow>
//                   );
//                 })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 20, 40, 100]}
//           component="div"
//           count={rows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//       <AddDataModal isOpen={openAddDatamodal} onClose={closeAddModal} handleUpdate={handleAddupdate} />
//       <EditDataModal isOpen={openEditDatamodal} onClose={closeEditModal} handleEditUpdate={handleEditUpdate} existingData={editData} />
//     </>
//   );
// };

// export default DashboardPage;


import Skeleton from '@mui/material/Skeleton';
import toast, { Toaster } from 'react-hot-toast';

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
        const fetchedData = response.data.data.map((item: any) =>
          createData(item._id, item.name, item.dob)
        );
        setRows(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    } catch (error) {
      console.error('Error deleting data:', error);
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
    <>
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
      <Paper sx={{ width: '100%', height: '70%', overflow: 'hidden' }}>
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
      <Toaster 
        position="top-right"
        reverseOrder={false}
      />
    </>
  );
};

export default DashboardPage;
