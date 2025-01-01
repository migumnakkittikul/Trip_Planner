import { Request, Response } from 'express';
import * as AirbnbService from '../services/airbnbService';
import { AirbnbFilter, AirbnbFilterSchema } from '../models/AirbnbFilter';

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const airbnbId = Number(req.params.id);
    // validate
    if (!airbnbId || isNaN(airbnbId)) {
      res.status(400).json({ message: 'Airbnb ID is required' });
      return;
    }
    const airbnb = await AirbnbService.getAirbnbById(airbnbId);
    if (airbnb) {
      res.status(200).json({
        message: 'Airbnb fetched successfully',
        data: airbnb
      });
      return;
    } else {
      res.status(404).json({ message: 'Airbnb not found' });
      return;
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
    return;
  }
}

export async function getAll(req: Request, res: Response): Promise<void> {
  // validate
  let filter: AirbnbFilter;
  try {
    filter = AirbnbFilterSchema.parse(req.body);
  } catch (error: any) {
    console.log("Validation errors: ", error.errors.map((err: any) => err.message + ' at ' + err.path.join('.')));
    res.status(400).json({ message: 'Invalid params' });
    return;
  }
  try {
    const airbnbs = await AirbnbService.getAllAirbnbs(filter);
    res.status(200).json({
      message: 'Airbnbs fetched successfully',
      data: airbnbs
    });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
    return;
  }
}