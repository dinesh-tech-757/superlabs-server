import {
  getAllJobPost,
  deleteJobPost,
  updatJobPost,
  postJob,
  getSingleJobPost,
} from "../controller/JobController.js";
import express from "express";
const router = express.Router();
import {
  postLocation,
  getLocation,
  updateLocation,
  deleteLocation,
} from "../controller/locationController.js";
import {
  postCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController.js";
import { getUser, deleteUser } from "../controller/usersController.js";

router.post("/jobpost", postJob);

router.get("/jobpost", getAllJobPost);

router.delete("/jobpost/:id", deleteJobPost);

router.put("/jobpost/:id", updatJobPost);

router.get("/jobpost/:id", getSingleJobPost);

//location
//create location
router.post("/location", postLocation);
//get all location
router.get("/location", getLocation);
//update location
router.put("/location/:id", updateLocation);
//delete location
router.delete("/location/:id", deleteLocation);

//category
//create category
router.post("/category", postCategory);
//get all category
router.get("/category", getCategory);
//update category
router.put("/category/:id", updateCategory);
//delete category
router.delete("/category/:id", deleteCategory);

//user
//get all category
router.get("/users", getUser);
//delete category
router.delete("/users/:id", deleteUser);

export default router;
