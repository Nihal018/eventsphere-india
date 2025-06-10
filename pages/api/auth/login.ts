import { NextApiRequest, NextApiResponse } from "next";
import { mockUsers } from "@/lib/data";
import { AuthResponse } from "@/types";

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
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email or username
    const user = mockUsers.find(
      (u) =>
        (u.email === email || u.username === email) && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate a simple token (in real app, use proper JWT)
    const token = `eventsphere_token_${user.id}_${Date.now()}`;

    // Return success without password
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      token,
      user: userWithoutPassword,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
