import {
  getAllJobPost,
  deleteJobPost,
  updateJobPost, // Fixed typo here
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
import { addCandidates, deleteCandidates, getAllCandidates, getSingleCandidates, updateCandidates } from "../controller/candidatesController.js";

router.post("/jobpost", postJob);

router.get("/jobpost", getAllJobPost);

router.delete("/jobpost/:id", deleteJobPost);

router.put("/jobpost/:id", updateJobPost); // Fixed typo here

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
//get all users
router.get("/users", getUser); // Fixed comment here
//delete user
router.delete("/users/:id", deleteUser); // Fixed comment here

//candidates
//get single candidate
router.get("/candidates/:id", getSingleCandidates); // Fixed comment here
//get all candidates
router.get("/candidates", getAllCandidates);
//add candidate
router.post("/candidates", addCandidates); // Fixed comment here
//update candidate
// router.put("/candidates/:id", updateCandidates); // Fixed comment here
//delete candidate
router.delete("/candidates/:id", deleteCandidates); // Fixed comment here

export default router;