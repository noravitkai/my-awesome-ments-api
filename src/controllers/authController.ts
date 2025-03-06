import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";

import { UserModel } from "../models/userModel";
import { User } from "../interfaces/user";
import { connect, disconnect } from "../repository/database";

/**
 * Register a new user
 * @param req
 * @param res
 */
export async function registerUser(req: Request, res: Response): Promise<void> {
  try {
    // Validate the registration data
    const { error } = validateUserRegistrationInfo(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    await connect();

    // Check if the email is already registered
    const emailExists = await UserModel.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400).json({ error: "Email already exists." });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(req.body.password, salt);

    // Create and save new user
    const userObject = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: passwordHashed,
    });
    const savedUser = await userObject.save();

    res.status(201).json({ error: null, data: savedUser._id });
  } catch (error) {
    res.status(500).send("Error registering user. Error: " + error);
  } finally {
    await disconnect();
  }
}

/**
 * Log in an existing user
 * @param req
 * @param res
 */
export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    // Validate the login data
    const { error } = validateUserLoginInfo(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    await connect();

    // Find the user by email
    const user: User | null = await UserModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      res.status(400).json({ error: "Password or email is wrong." });
      return;
    }

    // Compare provided password with stored hash
    const validPassword: boolean = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).json({ error: "Password or email is wrong." });
      return;
    }

    // Create JWT payload and sign the token
    const userId: string = user._id;
    const token: string = jwt.sign(
      {
        username: user.username,
        email: user.email,
        id: userId,
      },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "2h" }
    );

    // Send the token back in the header and response body
    res
      .status(200)
      .header("auth-token", token)
      .json({ error: null, data: { userId, token } });
  } catch (error) {
    res.status(500).send("Error logging in user. Error: " + error);
  } finally {
    await disconnect();
  }
}

/**
 * Verify the client's JWT token
 * @param req
 * @param res
 * @param next
 */
export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.header("auth-token");
  if (!token) {
    res.status(400).json({ error: "Access Denied." });
    return;
  }

  try {
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch {
    res.status(401).send("Invalid Token");
  }
}

/**
 * Validate user registration info
 * @param data
 */
export function validateUserRegistrationInfo(data: User): ValidationResult {
  const schema = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(20).required(),
  });
  return schema.validate(data);
}

/**
 * Validate user login info
 * @param data
 */
export function validateUserLoginInfo(data: User): ValidationResult {
  const schema = Joi.object({
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(20).required(),
  });
  return schema.validate(data);
}
