import express from 'express';
import {
  getAllCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt
} from '../controllers/courtController';

const router = express.Router();

// GET /api/courts - Get all courts with optional filtering
router.get('/', getAllCourts);

// GET /api/courts/:id - Get court by ID
router.get('/:id', getCourtById);

// POST /api/courts - Create new court
router.post('/', createCourt);

// PUT /api/courts/:id - Update court
router.put('/:id', updateCourt);

// DELETE /api/courts/:id - Delete court
router.delete('/:id', deleteCourt);

export default router;
