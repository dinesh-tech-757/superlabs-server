import client from "../config/connectdatabase.js";

const getUser = async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM users`);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { username, email, password } = req.body;
//     const updatedUser = await client.query(
//       `UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`,
//       [username, email, password, id]
//     );

//     if (updatedUser.rows.length === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json(updatedUser.rows[0]);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await client.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id]
    );

    if (deletedUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {  getUser };
