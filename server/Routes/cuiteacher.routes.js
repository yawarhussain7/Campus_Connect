import express from 'express'
import {getAllTeacherController,getTeacherByIdController,scrapeComsatsController} from '../Controller/teacher.controller.js'

const router = express.Router()


router.get("/", getAllTeacherController);

// Get single teacher
router.get("/:id", getTeacherByIdController);


// Scrape COMSATS
router.post(
  "/scrape-comsats",
  scrapeComsatsController
);

export default router