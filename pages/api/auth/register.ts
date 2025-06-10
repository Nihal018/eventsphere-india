import { NextApiRequest, NextApiResponse } from "next";
import { mockUsers } from "@/lib/data";
import { User, AuthResponse } from "@/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, username, password, firstName, lastName, phone } = req.body;

    // Validate required fields
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, username, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = mockUsers.find(
      (user) => user.email === email || user.username === username
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or username",
      });
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email,
      username,
      password, // In real app, hash this password
      firstName,
      lastName,
      phone,
      createdAt: new Date().toISOString(),
    };

    // Add to mock users array
    mockUsers.push(newUser);

    // Return success without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
