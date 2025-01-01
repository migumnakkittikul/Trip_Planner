import { Request, Response } from 'express';
import * as UserService from '../services/userService';
import * as PlanService from '../services/planService';
import { User, UserSchema } from '../models/User';

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({
      message: 'Users fetched successfully',
      data: users
    });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
    return;
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const userId = Number(req.params.id);
    // validate
    if (!userId || isNaN(userId)) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }
    const user = await UserService.getUserById(userId);
    if (user) {
      res.status(200).json({
        message: 'User fetched successfully',
        data: user
      });
      return;
    } else {
      res.status(404).json({ message: 'User not found' });
      return;
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
    return;
  }
}

export async function getByEmail(req: Request, res: Response): Promise<void> {
  try {
    const email = req.params.email;
    // validate
    if (!email) {
      console.log('Email is required');
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    const user = await UserService.getUserByEmail(email);
    if (user) {
      res.status(200).json({
        message: 'User fetched successfully',
        data: user
      });
      return;
    } else {
      res.status(404).json({ message: 'User not found' });
      return;
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
    return;
  }
}

export async function getPlansById(req: Request, res: Response): Promise<void> {
  // validate
  try {
    const userId = Number(req.params.id);
    if (!userId || isNaN(userId)) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }
    const plans = await PlanService.getPlansByUserId(userId);
    res.status(200).json({
      message: 'Plans fetched successfully',
      data: plans
    });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
    return;
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  // validate
  let user: User;
  try {
    user = UserSchema.parse(req.body);
  } catch (error: any) {
    console.log("User validation errors: ", error.errors.map((err: any) => err.message + ' at ' + err.path.join('.')));
    res.status(400).json({ message: 'Invalid user data' });
    return;
  }
  try {
    const newUser = await UserService.createUser(user);
    res.status(201).json({
      message: 'User created successfully',
      data: newUser
    });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
    return;
  }
}