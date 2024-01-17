import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  TableContainer,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { db } from "@app/firebase";

export const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsersAsync = async () => {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const usersLocal = [];
      querySnapshot.forEach((doc) => {
        usersLocal.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersLocal);
    };

    getUsersAsync();
  }, []);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography>Display Name</Typography>
            </TableCell>
            <TableCell>
              <Typography>Email</Typography>
            </TableCell>
            <TableCell>
              <Typography>Username</Typography>
            </TableCell>
            <TableCell>
              <Typography>Admin</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Typography>{user.displayName}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{user.email}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{user.username}</Typography>
              </TableCell>
              <TableCell>
                {user.isAdmin ? (
                  <CheckIcon color="success" />
                ) : (
                  <CloseIcon color="error" />
                )}
                {}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
