import client from "../config/connectdatabase.js";

const postLocation = async (req, res) => {
    try {
        const { location_title } = req.body;
        const newLocation = await client.query(
            `INSERT INTO location (location_title) VALUES($1) RETURNING *`,
            [location_title]
        );
        res.json(newLocation.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getLocation = async (req, res) => {
    try {
        const result = await client.query(`SELECT * FROM location`);
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { location_title } = req.body;
        const updatedLocation = await client.query(
            `UPDATE location SET location_title = $1 WHERE location_id = $2 RETURNING *`,
            [location_title, id]
        );

        if (updatedLocation.rows.length === 0) {
            return res.status(404).json({ error: "Location not found" });
        }

        res.json(updatedLocation.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLocation = await client.query(
            `DELETE FROM location WHERE location_id = $1 RETURNING *`,
            [id]
        );

        if (deletedLocation.rows.length === 0) {
            return res.status(404).json({ error: "Location not found" });
        }

        res.json({ message: "Location deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { postLocation, getLocation, updateLocation, deleteLocation };
