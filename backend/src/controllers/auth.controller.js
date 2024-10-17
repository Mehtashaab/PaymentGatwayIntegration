import User  from "../models/user.model.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error.message);
    throw new Error("Internal server error. Please try again later.");
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, password, confirmpassword } = req.body;

    // Validate if all fields are provided
    if (
      [email, password, confirmpassword].some((field) => field?.trim() === "")
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }] });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create the user and save avatar metadata in the database
    const user = await User.create({
      email,
      password,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        email,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide username and password" });
  }
  const user = await User.findOne({ email }).select("+password");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "User logged in successfully",
      user: loggedInUser,
      accessToken,
      refreshToken,
    });
};
const logoutUser = async (req, res) => {
    
    console.log("User in request:", req.user);
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: "Unauthorized user" });
    }
  
    try {
        // Remove the refresh token from the user document
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: { refreshToken: 1 },
            },
            {
                new: true,
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Options for cookies
        const options = {
            httpOnly: true,
            secure: true
        };

        console.log("Clearing cookies");
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                message: "User logged out successfully",
            });
    } catch (error) {
        console.error("Error during logout:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(401).json({ error: "Refresh token does not match" });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        message: "Access token refreshed",
        accessToken,
        refreshToken: newRefreshToken,
      });
  } catch (error) {
    console.error("Error refreshing access token:", error.message);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  generateAccessAndRefereshTokens,
  refreshAccessToken,
};
