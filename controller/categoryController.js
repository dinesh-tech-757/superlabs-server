// import client from "../config/connectdatabase.js";

// const postCategory = async (req, res) => {
//     try {
//         const { category_title } = req.body;
//         const newCategory = await client.query(
//             `INSERT INTO category (category_title) VALUES($1) RETURNING *`,
//             [category_title]
//         );
//         res.json(newCategory.rows[0]);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// const getCategory = async (req, res) => {
//     try {
//         const result = await client.query(`SELECT * FROM category`);
//         res.json(result.rows);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// const updateCategory = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { category_title } = req.body;
//         const updatedCategory = await client.query(
//             `UPDATE category SET category_title = $1 WHERE category_id = $2 RETURNING *`,
//             [category_title, id]
//         );

//         if (updatedCategory.rows.length === 0) {
//             return res.status(404).json({ error: "Category not found" });
//         }

//         res.json(updatedCategory.rows[0]);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// const deleteCategory = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedCategory = await client.query(
//             `DELETE FROM category WHERE category_id = $1 RETURNING *`,
//             [id]
//         );

//         if (deletedCategory.rows.length === 0) {
//             return res.status(404).json({ error: "Category not found" });
//         }

//         res.json({ message: "Category deleted successfully" });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// export default { postCategory, getCategory, updateCategory, deleteCategory };

import client from "../config/connectdatabase.js";

const postCategory = async (req, res) => {
    try {
        const { category_title } = req.body;
        const newCategory = await client.query(
            `INSERT INTO category (category_title) VALUES($1) RETURNING *`,
            [category_title]
        );
        res.json(newCategory.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getCategory = async (req, res) => {
    try {
        const result = await client.query(`SELECT * FROM category`);
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_title } = req.body;
        const updatedCategory = await client.query(
            `UPDATE category SET category_title = $1 WHERE category_id = $2 RETURNING *`,
            [category_title, id]
        );

        if (updatedCategory.rows.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json(updatedCategory.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await client.query(
            `DELETE FROM category WHERE category_id = $1 RETURNING *`,
            [id]
        );

        if (deletedCategory.rows.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { postCategory, getCategory, updateCategory, deleteCategory };