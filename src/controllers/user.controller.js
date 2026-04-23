import { userService } from "../services/user.service.js";
import { createUserSchema, updateUserSchema } from "../validators/user.validator.js";

export async function getUsers(req, res) {
  try {
    const users = await userService.getUsers();
    return res.status(200).json(users);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    if (error.message === "Invalid user id") {
      return res.status(400).json({ error: "Valid user ID is required" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function createUser(req, res) {
  const { error, value } = createUserSchema.validate(req.body, {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newUser = await userService.createUser(value);
    return res.status(201).json(newUser);
  } catch (serviceError) {
    if (serviceError?.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function updateUser(req, res) {
  const { error, value } = updateUserSchema.validate(req.body, {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error && !req.file) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const data = { ...(error ? {} : value) };

  if (req.file) {
    data.image = req.file.filename;
  }

  if (!Object.keys(data).length) {
    return res.status(400).json({ error: "At least one field is required" });
  }

  try {
    const updatedUser = await userService.updateUser(req.user.userId, data);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (serviceError) {
    console.error("Update user error:", serviceError);

    if (serviceError.message === "Invalid user id") {
      return res.status(400).json({ error: "Valid user ID is required" });
    }

    if (serviceError.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }

    if (serviceError?.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteUser(req, res) {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.message === "Invalid user id") {
      return res.status(400).json({ error: "Valid user ID is required" });
    }

    if (error.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getMe(req, res) {
  try {
    const user = await userService.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);

    if (error.message === "Invalid user id") {
      return res.status(400).json({ error: "Valid user ID is required" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
